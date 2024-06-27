import { atom, computed } from 'nanostores';

import {
  $totalItems,
  $currentItem,
  $currentItemChanges,
  $currentCharacterItems,
} from './character';
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
  const targetOriginItem = $currentCharacterItems.get()[category];
  const targetItem = $currentItemChanges.get()[category];

  /* if slot is in current item, mark as delete */
  if (targetOriginItem && !targetItem) {
    $currentItemChanges.setKey(category, {
      ...targetOriginItem,
      isDeleted: true,
    });
  } else if (targetItem) {
    $currentItemChanges.setKey(`${category}.isDeleted`, true);
  }
}
