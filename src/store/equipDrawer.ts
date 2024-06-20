import { atom, map, computed } from 'nanostores';

import { $equipmentStrings } from './string';

import { EquipCategory, AllCategory } from '@/const/equipments';
import { HairColor } from '@/const/hair';
import { FaceColor } from '@/const/face';

export enum EquipTab {
  Equip = 'equip',
  Hair = 'hair',
  Face = 'face',
  History = 'history',
}

export const $equipmentDrawerEquipTab = atom<EquipTab>(EquipTab.Equip);
export const $equipmentDrawerEquipCategory = atom<
  EquipCategory | typeof AllCategory
>(AllCategory);
export const $equipmentDrawerHairColor = atom<HairColor>(HairColor.Black);
export const $equipmentDrawerFaceColor = atom<FaceColor>(FaceColor.Black);

export const $equipmentDrawerSearch = map<
  Partial<Record<EquipCategory | typeof AllCategory, string>>
>({});

/* computed */
export const $currentEquipmentDrawerCategory = computed(
  [$equipmentDrawerEquipCategory, $equipmentDrawerEquipTab],
  (category, tab) => {
    if (tab === EquipTab.Hair) {
      return EquipCategory.Hair;
    }
    if (tab === EquipTab.Face) {
      return EquipCategory.Face;
    }
    return category;
  },
);
export const $currentEquipmentDrawerSearch = computed(
  [$currentEquipmentDrawerCategory, $equipmentDrawerSearch],
  (category, search) => search[category] || '',
);

export const $categoryFilteredString = computed(
  [$currentEquipmentDrawerCategory, $equipmentStrings],
  (category, strings) => {
    return category !== AllCategory
      ? strings.filter((item) => item.category === category)
      : strings;
  },
);
export const $equipmentDrawerEquipFilteredString = computed(
  [$categoryFilteredString, $currentEquipmentDrawerSearch],
  (strings, searchKey) => {
    if (searchKey) {
      return strings.filter(
        (item) =>
          item.name.includes(searchKey) || item.id.toString() === searchKey,
      );
    }

    return strings;
  },
);
