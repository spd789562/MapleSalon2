import { invoke } from '@tauri-apps/api/core';
import { getCurrentWebview } from '@tauri-apps/api/webview';

import type { AppTranslator } from '@/context/i18n';

import { atom } from 'nanostores';

import { $apiHost, $isInitialized } from '@/store/const';
import { initializeSavedCharacter } from '@/store/characterDrawer';
import {
  initializeSavedFileSelectHistory,
  appendPathToHistory,
  getLastSelectedPath,
  setLastSelectedPath,
} from '@/store/fileSelectHistory';
import {
  initializeSavedSetting,
  $clearCacheWhenLoad,
} from '@/store/settingDialog';
import { initializeSavedEquipmentHistory } from '@/store/equipHistory';
import { initializeSavedEquipmentFavorite } from '@/store/equipFavorite';
import { prepareAndFetchEquipStrings } from '@/store/string';
import { initialGlobalRenderer } from '@/store/renderer';
import { initialUserUploadedSceneImages } from '@/store/scene';

import { toaster } from '@/components/GlobalToast';
import { nextTick } from '@/utils/eventLoop';

export enum InitLoadProgress {
  SaveFile = 'save_file',
  InitWz = 'init_wz',
  InitString = 'init_string',
  InitItem = 'init_item',
  Done = 'done',
}

export const $isWzLoading = atom(false);
export const $initLoadProgress = atom<InitLoadProgress | undefined>();

export function initialWzBase(path: string) {
  return invoke<number>('init', { path });
}

export function getServerInfo() {
  return invoke<{
    url: string;
    is_initialized: boolean;
    is_load_items: boolean;
  }>('get_server_url');
}

export async function initApp(t: AppTranslator) {
  $isWzLoading.set(true);
  $initLoadProgress.set(InitLoadProgress.SaveFile);
  await nextTick();
  try {
    await initializeSavedCharacter();
    await initializeSavedFileSelectHistory();
    await initializeSavedSetting();
    await initializeSavedEquipmentHistory();
    await initializeSavedEquipmentFavorite();
  } catch (_) {
    toaster.error({
      title: t('error.initTitle'),
      description: t('error.initDescPermission'),
      duration: 20000,
    });
    $isWzLoading.set(false);
    return;
  }
  /* this should infailable */
  const { url, is_initialized } = await getServerInfo();

  $apiHost.set(url);

  if (is_initialized) {
    await initStringAndRenderer(t);
    $isInitialized.set(is_initialized);
  }

  $initLoadProgress.set(undefined);
  $isWzLoading.set(false);
  console.info('API host:', url);
}

export async function initByWzBase(path: string, t: AppTranslator) {
  $isWzLoading.set(true);
  $initLoadProgress.set(InitLoadProgress.InitWz);
  await nextTick();
  let version = 0;
  try {
    version = await initialWzBase(path);
  } catch (e) {
    let message = t('error.unknownError');
    if (e instanceof Error) {
      message = e.message;
    }
    toaster.error({
      title: t('error.initBaseWzTitle'),
      description: t('error.message', { text: message }) as string,
    });
    $isWzLoading.set(false);
    return false;
  }

  const pathHash = `${path}#${version}`;
  const lastPath = await getLastSelectedPath();
  let isNeedClearCache = $clearCacheWhenLoad.get();
  if (lastPath !== pathHash) {
    await setLastSelectedPath(pathHash);
    isNeedClearCache = !!lastPath;
  }
  if (isNeedClearCache) {
    await getCurrentWebview().clearAllBrowsingData();
  }

  const isSuccess = await initStringAndRenderer(t);

  if (!isSuccess) {
    $isWzLoading.set(false);
    return false;
  }

  $isInitialized.set(true);

  await appendPathToHistory(path);

  $isWzLoading.set(false);
  return true;
}

export async function initStringAndRenderer(t: AppTranslator) {
  try {
    await prepareAndFetchEquipStrings();
  } catch (_) {
    toaster.error({
      title: t('error.initTitle'),
      description: t('error.initEquipError'),
    });
    return false;
  }

  initialUserUploadedSceneImages();

  $initLoadProgress.set(InitLoadProgress.Done);
  await nextTick();

  try {
    await initialGlobalRenderer();
  } catch (_) {
    toaster.error({
      title: t('error.initTitle'),
      description: t('error.initRendererError'),
    });
    return false;
  }
  return true;
}
