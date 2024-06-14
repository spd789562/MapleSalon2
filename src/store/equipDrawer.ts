import { atom, map, computed } from 'nanostores';

import { $equipmentStrings } from './string';

import { type EquipCategory, AllCategory } from '@/const/equipments';
import { HairColor } from '@/const/hair';
import { FaceColor } from '@/const/face';

export const $equipmentDrawerEquipCategory = atom<
  EquipCategory | typeof AllCategory
>(AllCategory);
export const $equipmentDrawerHairColor = atom<HairColor>(HairColor.Black);
export const $equipmentDrawerFaceColor = atom<FaceColor>(FaceColor.Black);

export const $equipmentDrawerHover = atom<string | null>(null);

export const $equipmentDrawerSearch = map<
  Partial<Record<EquipCategory | typeof AllCategory, string>>
>({});

/* computed */
export const $categoryFilteredString = computed(
  [$equipmentDrawerEquipCategory, $equipmentStrings],
  (category, strings) => {
    return category !== AllCategory
      ? strings.filter((item) => item.category === category)
      : strings;
  },
);
export const $equipmentDrawerEquipFilteredString = computed(
  [
    $equipmentDrawerEquipCategory,
    $categoryFilteredString,
    $equipmentDrawerSearch,
  ],
  (category, strings, searchString) => {
    const searchKey = searchString[category];

    if (searchKey) {
      return strings.filter((item) => item.name.includes(searchKey));
    }

    return strings;
  },
);
