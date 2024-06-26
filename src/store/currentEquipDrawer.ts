import { atom, computed } from 'nanostores';

import { $totalItems } from './character';

import type { EquipSubCategory } from '@/const/equipments';

/* computed */
export const $currentItemKeys = computed($totalItems, (items) => {
  return Object.keys(items).filter((e) => e !== 'Body') as EquipSubCategory[];
});
