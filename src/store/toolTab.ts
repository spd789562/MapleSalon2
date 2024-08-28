import { atom, deepMap } from 'nanostores';

import type { EquipSubCategory } from '@/const/equipments';
import { type ToolTab, ActionExportType } from '@/const/toolTab';
import { CharacterAction } from '@/const/actions';

export const $toolTab = atom<ToolTab | undefined>(undefined);

export const $actionExportType = atom<ActionExportType>(ActionExportType.Gif);

export const $onlyShowDyeable = atom<boolean>(false);
export const $preserveOriginalDye = atom<boolean>(false);
export const $selectedEquipSubCategory = atom<EquipSubCategory[]>([]);
export const $dyeResultCount = atom<number>(72);
export const $dyeAction = atom<CharacterAction>(CharacterAction.Stand1);

export enum DyeOrder {
  Up = 'up',
  Down = 'down',
}
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

/* actions */
export function toggleDyeConfigEnabled(key: keyof DyeConfig, value: boolean) {
  $dyeConfig.setKey(`${key}.enabled`, value);
}
export function toggleDyeConfigOrder(key: keyof DyeConfig, order: DyeOrder) {
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
