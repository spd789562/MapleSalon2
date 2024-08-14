import { deepMap, computed } from 'nanostores';

import { Store } from '@tauri-apps/plugin-store';

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
}

const DEFAULT_SETTING: AppSetting = {
  windowResizable: true,
  windowResolution: WindowResolutions[0].name,
  theme: Theme.Iris,
  colorMode: ColorMode.System,
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

/* action */
export async function initializeSavedSetting() {
  try {
    const setting = await fileStore.get<AppSetting | undefined>(SAVE_KEY);
    if (setting) {
      $appSetting.setKey('windowResizable', !!setting.windowResizable);
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
