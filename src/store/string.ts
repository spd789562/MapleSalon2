import { atom } from 'nanostores';

import type { EquipCategory } from '@/const/equipments';

export interface EquipItem {
  category: EquipCategory;
  id: number;
  name: string;
}

export const $equipmentStrings = atom<EquipItem[]>([]);
