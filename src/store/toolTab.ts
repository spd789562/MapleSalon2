import { atom, deepMap, computed, batched } from 'nanostores';

import type { EquipSubCategory } from '@/const/equipments';
import {
  type ToolTab,
  ActionExportType,
  DyeOrder,
  DyeType,
} from '@/const/toolTab';
import { CharacterAction } from '@/const/actions';

export const $toolTab = atom<ToolTab | undefined>(undefined);

export const $actionExportType = atom<ActionExportType>(ActionExportType.Gif);

export const $onlyShowDyeable = atom<boolean>(true);
export const $preserveOriginalDye = atom<boolean>(true);
export const $selectedEquipSubCategory = atom<EquipSubCategory[]>([]);
export const $dyeResultCount = atom<number>(72);
export const $dyeAction = atom<CharacterAction>(CharacterAction.Stand1);

export interface DyeConfigOption {
  enabled: boolean;
  order: DyeOrder;
}
export type DyeConfig = {
  hue: DyeConfigOption;
  saturation: DyeConfigOption;
  lightness: DyeConfigOption;
};
export const $dyeConfig = deepMap({
  hue: {
    enabled: false,
    order: DyeOrder.Up,
  },
  saturation: {
    enabled: false,
    order: DyeOrder.Up,
  },
  lightness: {
    enabled: false,
    order: DyeOrder.Up,
  },
});

/* selector */
export const $dyeTypeEnabled = batched($dyeConfig, (config) => {
  for (const k of Object.values(DyeType) as DyeType[]) {
    if (config[k].enabled) {
      return k;
    }
  }
  return undefined;
});

/* action */
export function disableOtherDyeConfig(key: DyeType) {
  for (const k of Object.values(DyeType) as DyeType[]) {
    if (k !== key) {
      $dyeConfig.setKey(`${k}.enabled`, false);
    }
  }
}
export function toggleDyeConfigEnabled(key: DyeType, value: boolean) {
  $dyeConfig.setKey(`${key}.enabled`, value);
  disableOtherDyeConfig(key);
}
export function toggleDyeConfigOrder(key: DyeType, order: DyeOrder) {
  $dyeConfig.setKey(`${key}.order`, order);
}
export function selectDyeCategory(category: EquipSubCategory) {
  const current = $selectedEquipSubCategory.get();
  if (current.includes(category)) {
    return;
  }
  $selectedEquipSubCategory.set([...$selectedEquipSubCategory.get(), category]);
}
export function deselectDyeCategory(category: EquipSubCategory) {
  $selectedEquipSubCategory.set(
    $selectedEquipSubCategory.get().filter((c) => c !== category),
  );
}
export function setDyeResultCount(count: number) {
  $dyeResultCount.set(count);
}
export function setDyeAction(action: CharacterAction) {
  $dyeAction.set(action);
}
