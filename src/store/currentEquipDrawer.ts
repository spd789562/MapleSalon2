import { computed, atom } from 'nanostores';

import { $currentItem, $currentItemChanges } from './character/store';
import { $totalItems } from './character/selector';
import { $equpimentDrawerOpen } from './trigger';
import {
  $equipmentDrawerEquipCategory,
  $equipmentDrawerEquipTab,
  EquipTab,
} from './equipDrawer';

import type { EquipSubCategory } from '@/const/equipments';

export enum CurrentEquipDrawerTab {
  Equip = 'equip',
  Setting = 'setting',
}
export const $currentEquipDrawerTab = atom<CurrentEquipDrawerTab>(
  CurrentEquipDrawerTab.Equip,
);

/* computed */
export const $currentItemKeys = computed($totalItems, (items) => {
  return Object.keys(items).filter((e) => e !== 'Body') as EquipSubCategory[];
});

/* actions */
export function openCertainCategory(category: EquipSubCategory) {
  if (!$equpimentDrawerOpen.get()) {
    $equpimentDrawerOpen.set(true);
  }
  if (category === 'Hair') {
    return $equipmentDrawerEquipTab.set(EquipTab.Hair);
  }
  if (category === 'Face') {
    return $equipmentDrawerEquipTab.set(EquipTab.Face);
  }
  if ($equipmentDrawerEquipTab.get() !== EquipTab.Equip) {
    $equipmentDrawerEquipTab.set(EquipTab.Equip);
  }
  if ($equipmentDrawerEquipCategory.get() !== category) {
    $equipmentDrawerEquipCategory.set(category);
  }
}
export function openSkinSelection() {
  openCertainCategory('Skin');
}
export function openNameTagSelection() {
  openCertainCategory('NameTag');
}
export function openChatBalloonSelection() {
  openCertainCategory('ChatBalloon');
}

export function editCurrentItem(data: {
  id: number;
  name: string;
}) {
  if (!$equpimentDrawerOpen.get()) {
    $equpimentDrawerOpen.set(true);
  }
  if ($currentItem.get()?.id !== data.id) {
    $currentItem.set(data);
  }
}
export function removeItems(category: EquipSubCategory) {
  /* if slot is in current item, mark as delete */
  $currentItemChanges.setKey(`${category}.isDeleted`, true);

  // if item is currently edit, also remove it from $currentItem
  const targetItem = $currentItemChanges.get()[category];
  if ($currentItem.get()?.id === targetItem?.id) {
    $currentItem.set(undefined);
  }
}
