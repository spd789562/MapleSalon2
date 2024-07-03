import { atom } from 'nanostores';

import type { EquipCategory } from '@/const/equipments';
import type { Gender } from '@/utils/itemId';

const MAX_HISTORY_SIZE = 200;

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

/** all items  */
export const $equipmentStrings = atom<EquipItem[]>([]);
/** items recently select */
export const $equipmentHistory = atom<EquipItem[]>([]);

/* actions */
export function getEquipById(id: number) {
  return $equipmentStrings.get().find((e) => e.id === id);
}
export function appendHistory(item: EquipItem) {
  const current = $equipmentHistory.get().filter((e) => e.id !== item.id);
  const history = [item, ...current];
  if (history.length > MAX_HISTORY_SIZE) {
    $equipmentHistory.set(history.slice(0, MAX_HISTORY_SIZE));
  } else {
    $equipmentHistory.set(history);
  }
}
