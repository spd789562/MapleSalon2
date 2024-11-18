import { deepMap, computed } from 'nanostores';

import { load } from '@tauri-apps/plugin-store';

import { $equipmentDrawerExperimentCharacterRender } from './equipDrawer';
import { $preferRenderer as $rendererPreference } from './renderer';
import { $actionExportType } from './toolTab';

import { TextureStyle } from 'pixi.js';

import {
  simpleCharacterLoadingQueue,
  isValidConcurrency,
  DEFAULT_CONCURRENCY,
  SUGGEST_MAX_CONCURRENCY,
} from '@/utils/characterLoadingQueue';
import {
  WindowResolutions,
  isValidResolution,
  type Resolution,
} from '@/const/setting/window';

import { Theme, isValidTheme, syncTheme } from '@/const/setting/theme';
import {
  ColorMode,
  isValidColorMode,
  syncColorMode,
} from '@/const/setting/colorMode';
import { ActionExportType, isValidExportType } from '@/const/toolTab';

const SAVE_FILENAME = 'setting.bin';

const SAVE_KEY = 'setting';

/** file selection save, a presistence store on file */
export const fileStore = await load(SAVE_FILENAME);

export interface AppSetting extends Record<string, unknown> {
  /* window */
  windowResizable: boolean;
  windowResolution: Resolution;
  /* theme */
  theme: Theme;
  colorMode: ColorMode;
  /* render */
  preferRenderer: 'webgl' | 'webgpu';
  preferScaleMode: 'linear' | 'nearest';
  simpleCharacterConcurrency: number;
  enableExperimentalUpscale: boolean;
  /* list */
  defaultCharacterRendering: boolean;
  showItemGender: boolean;
  showItemDyeable: boolean;

  defaultLoadItem: boolean;
  /* export */
  exportType: ActionExportType;
  padWhiteSpaceWhenExportFrame: boolean;
  addBlackBgWhenExportGif: boolean;
}

const DEFAULT_SETTING: AppSetting = {
  windowResizable: true,
  windowResolution: WindowResolutions[0].name,
  theme: Theme.Iris,
  colorMode: ColorMode.System,
  simpleCharacterConcurrency: DEFAULT_CONCURRENCY,
  defaultCharacterRendering: false,
  showItemGender: true,
  showItemDyeable: true,
  defaultLoadItem: true,
  enableExperimentalUpscale: false,
  preferRenderer: 'webgpu',
  preferScaleMode: 'linear',
  exportType: ActionExportType.Webp,
  padWhiteSpaceWhenExportFrame: true,
  addBlackBgWhenExportGif: false,
};

export const $appSetting = deepMap<AppSetting>(DEFAULT_SETTING);

/* selector */
export const $windowResizable = computed(
  $appSetting,
  (setting) => setting.windowResizable,
);
export const $windowResolution = computed(
  $appSetting,
  (setting) => setting.windowResolution,
);
export const $theme = computed($appSetting, (setting) => setting.theme);
export const $colorMode = computed($appSetting, (setting) => setting.colorMode);
export const $simpleCharacterConcurrency = computed(
  $appSetting,
  (setting) => setting.simpleCharacterConcurrency,
);
export const $defaultCharacterRendering = computed(
  $appSetting,
  (setting) => setting.defaultCharacterRendering,
);
export const $showItemGender = computed(
  $appSetting,
  (setting) => setting.showItemGender,
);
export const $showItemDyeable = computed(
  $appSetting,
  (setting) => setting.showItemDyeable,
);
export const $enableExperimentalUpscale = computed(
  $appSetting,
  (setting) => setting.enableExperimentalUpscale,
);
export const $preferRenderer = computed(
  $appSetting,
  (setting) => setting.preferRenderer,
);
export const $preferScaleMode = computed(
  $appSetting,
  (setting) => setting.preferScaleMode,
);
export const $exportType = computed(
  $appSetting,
  (setting) => setting.exportType,
);
export const $padWhiteSpaceWhenExportFrame = computed(
  $appSetting,
  (setting) => setting.padWhiteSpaceWhenExportFrame,
);
export const $addBlackBgWhenExportGif = computed(
  $appSetting,
  (setting) => setting.addBlackBgWhenExportGif,
);
export const $defaultLoadItem = computed(
  $appSetting,
  (setting) => setting.defaultLoadItem,
);

/* action */
export async function initializeSavedSetting() {
  try {
    const setting = await fileStore.get<AppSetting | undefined>(SAVE_KEY);
    if (setting) {
      $appSetting.setKey('windowResizable', !!setting.windowResizable);
      $appSetting.setKey('showItemGender', setting.showItemGender ?? true);
      $appSetting.setKey('showItemDyeable', setting.showItemDyeable ?? true);
      $appSetting.setKey(
        'enableExperimentalUpscale',
        !!setting.enableExperimentalUpscale,
      );
      $appSetting.setKey('defaultLoadItem', !!setting.defaultLoadItem);
      const defaultCharacterRendering = !!setting.defaultCharacterRendering;
      if (defaultCharacterRendering) {
        $appSetting.setKey('defaultCharacterRendering', true);
        $equipmentDrawerExperimentCharacterRender.set(true);
      }
      if (
        setting.preferRenderer === 'webgl' ||
        setting.preferRenderer === 'webgpu'
      ) {
        $appSetting.setKey('preferRenderer', setting.preferRenderer);
        $rendererPreference.set(setting.preferRenderer);
      }
      if (
        setting.preferScaleMode === 'linear' ||
        setting.preferScaleMode === 'nearest'
      ) {
        $appSetting.setKey('preferScaleMode', setting.preferScaleMode);
        // seens pixi's default is linear, if set to nearest, then change it when initialize
        if (setting.preferScaleMode === 'nearest') {
          TextureStyle.defaultOptions.scaleMode = 'nearest';
        }
      }
      if (isValidResolution(setting.windowResolution)) {
        $appSetting.setKey('windowResolution', setting.windowResolution);
      }
      if (isValidTheme(setting.theme)) {
        syncTheme(setting.theme);
        $appSetting.setKey('theme', setting.theme);
      }
      if (isValidColorMode(setting.colorMode)) {
        syncColorMode(setting.colorMode);
        $appSetting.setKey('colorMode', setting.colorMode);
      } else {
        syncColorMode(ColorMode.System);
      }
      if (isValidConcurrency(setting.simpleCharacterConcurrency)) {
        const concurrency = Math.min(
          setting.simpleCharacterConcurrency,
          SUGGEST_MAX_CONCURRENCY,
        );
        $appSetting.setKey('simpleCharacterConcurrency', concurrency);
        simpleCharacterLoadingQueue.concurrency = concurrency;
      }
      /* export */
      if (isValidExportType(setting.exportType)) {
        $appSetting.setKey('exportType', setting.exportType);
        $actionExportType.set(setting.exportType);
      }
      $appSetting.setKey(
        'padWhiteSpaceWhenExportFrame',
        setting.padWhiteSpaceWhenExportFrame ?? true,
      );
      $appSetting.setKey(
        'addBlackBgWhenExportGif',
        !!setting.addBlackBgWhenExportGif,
      );
    }
  } catch (e) {
    console.error(e);
  }
}

export async function saveSetting() {
  const setting = $appSetting.get();
  await fileStore.set(SAVE_KEY, setting);
  await fileStore.save();
}

export function setWindowResizable(value: boolean) {
  $appSetting.setKey('windowResizable', value);
}
export function setWindowResolution(value: Resolution) {
  $appSetting.setKey('windowResolution', value);
}
export function setTheme(value: Theme) {
  $appSetting.setKey('theme', value);
}
export function setColorMode(value: ColorMode) {
  $appSetting.setKey('colorMode', value);
}
export function setSimpleCharacterConcurrency(value: number) {
  $appSetting.setKey('simpleCharacterConcurrency', value);
}
export function setDefaultCharacterRendering(value: boolean) {
  $appSetting.setKey('defaultCharacterRendering', value);
}
export function setShowItemGender(value: boolean) {
  $appSetting.setKey('showItemGender', value);
}
export function setShowItemDyeable(value: boolean) {
  $appSetting.setKey('showItemDyeable', value);
}
export function setDefaultLoadItem(value: boolean) {
  $appSetting.setKey('defaultLoadItem', value);
  // @TODO: when move the function to actuall setting remove the save line
  saveSetting();
}
export function setEnableExperimentalUpscale(value: boolean) {
  $appSetting.setKey('enableExperimentalUpscale', value);
}
export function setPreferRenderer(value: 'webgl' | 'webgpu') {
  $appSetting.setKey('preferRenderer', value);
}
export function setExportType(value: ActionExportType) {
  $appSetting.setKey('exportType', value);
}
export function setPadWhiteSpaceWhenExportFrame(value: boolean) {
  $appSetting.setKey('padWhiteSpaceWhenExportFrame', value);
}
export function setAddBlackBgWhenExportGif(value: boolean) {
  $appSetting.setKey('addBlackBgWhenExportGif', value);
}
export function setPreferScaleMode(value: 'linear' | 'nearest') {
  $appSetting.setKey('preferScaleMode', value);
  TextureStyle.defaultOptions.scaleMode = value;
}
