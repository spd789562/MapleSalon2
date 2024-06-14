import { atom, computed } from 'nanostores';

import { $equipmentStrings } from './string';

import { type EquipCategory, AllCategory } from '@/const/equipments';
import { HairColor } from '@/const/hair';
import { FaceColor } from '@/const/face';

export const $equipmentDrawerEquipCategory = atom<
  EquipCategory | typeof AllCategory
>(AllCategory);
export const $equipmentDrawerHairColor = atom<HairColor>(HairColor.Black);
export const $equipmentDrawerFaceColor = atom<FaceColor>(FaceColor.Black);

export const $equipmentDrawerSearch = atom<
  Partial<Record<EquipCategory | typeof AllCategory, string>>
>({});

/* computed */
export const $equipmentDrawerEquipFilteredString = computed(
  [$equipmentDrawerEquipCategory, $equipmentStrings, $equipmentDrawerSearch],
  (category, strings, searchString) => {
    let result = strings;
    if (category !== AllCategory) {
      result = result.filter((item) => item.category === category);
    }
    const searchKey = searchString[AllCategory];
    if (searchKey) {
      result = result.filter((item) => item.name.includes(searchKey));
    }

    return result;
  },
);
