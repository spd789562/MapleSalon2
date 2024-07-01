import { atom } from 'nanostores';

import type { EquipCategory } from '@/const/equipments';
import type { Gender } from '@/utils/itemId';

export interface ItemExtraInfo {
  isDyeable: boolean;
  isCash: boolean;
}

export interface EquipItem extends Partial<ItemExtraInfo> {
  category: EquipCategory;
  id: number;
  name: string;
  gender?: Gender;
  /* the item is got extra item info such as can dye or cash item */
  isFetchExtra?: boolean;
}

export const $equipmentStrings = atom<EquipItem[]>([]);

/* actions */
export function getEquipById(id: number) {
  return $equipmentStrings.get().find((e) => e.id === id);
}
