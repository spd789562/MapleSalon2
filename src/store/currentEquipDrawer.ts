import { computed } from 'nanostores';

import {
  $currentItem,
  $currentItemChanges,
  $currentCharacterItems,
} from './character/store';
import { $totalItems } from './character/selector';
import { $equpimentDrawerOpen } from './trigger';
import {
  $equipmentDrawerEquipCategory,
  $equipmentDrawerEquipTab,
  EquipTab,
} from './equipDrawer';

import type { EquipSubCategory } from '@/const/equipments';

/* computed */
export const $currentItemKeys = computed($totalItems, (items) => {
  return Object.keys(items).filter((e) => e !== 'Body') as EquipSubCategory[];
});

/* actions */
export function openSkinSelection() {
  if (!$equpimentDrawerOpen.get()) {
    $equpimentDrawerOpen.set(true);
  }
  if ($equipmentDrawerEquipTab.get() !== EquipTab.Equip) {
    $equipmentDrawerEquipTab.set(EquipTab.Equip);
  }
  if ($equipmentDrawerEquipCategory.get() !== 'Skin') {
    $equipmentDrawerEquipCategory.set('Skin');
  }
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
