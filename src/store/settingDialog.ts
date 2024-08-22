import { deepMap, computed } from 'nanostores';

import { Store } from '@tauri-apps/plugin-store';

import { $equipmentDrawerExperimentCharacterRender } from './equipDrawer';

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

const SAVE_FILENAME = 'setting.bin';

const SAVE_KEY = 'setting';

/** file selection save, a presistence store on file */
export const fileStore = new Store(SAVE_FILENAME);

export interface AppSetting extends Record<string, unknown> {
  windowResizable: boolean;
  windowResolution: Resolution;
  theme: Theme;
  colorMode: ColorMode;
  simpleCharacterConcurrency: number;
  defaultCharacterRendering: boolean;
  showItemGender: boolean;
  showItemDyeable: boolean;
  enableExperimentalUpscale: boolean;
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
  enableExperimentalUpscale: false,
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

/* action */
export async function initializeSavedSetting() {
  try {
    const setting = await fileStore.get<AppSetting | undefined>(SAVE_KEY);
    if (setting) {
      $appSetting.setKey('windowResizable', !!setting.windowResizable);
      $appSetting.setKey('showItemGender', setting.showItemGender ?? true);
      $appSetting.setKey('showItemDyeable', setting.showItemDyeable ?? true);
      const defaultCharacterRendering = !!setting.defaultCharacterRendering;
      if (defaultCharacterRendering) {
        $appSetting.setKey('defaultCharacterRendering', true);
        $equipmentDrawerExperimentCharacterRender.set(true);
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
export function setEnableExperimentalUpscale(value: boolean) {
  $appSetting.setKey('enableExperimentalUpscale', value);
}
