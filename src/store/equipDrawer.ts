import { atom, map, computed } from 'nanostores';

import { $equipmentStrings } from './string';

import { getCategoryBySubCategory, getSubCategory } from '@/utils/itemId';
import { getFaceColorId, getHairColorId } from '@/utils/mixDye';

import {
  AllCategory,
  EquipCategory,
  type EquipSubCategory,
} from '@/const/equipments';
import { HairColor } from '@/const/hair';
import { FaceColor } from '@/const/face';

export enum EquipTab {
  Equip = 'equip',
  Hair = 'hair',
  Face = 'face',
  History = 'history',
}

export type EquipCategorySelections = EquipSubCategory | typeof AllCategory;

export const $equipmentDrawerEquipTab = atom<EquipTab>(EquipTab.Equip);
export const $equipmentDrawerEquipCategory =
  atom<EquipCategorySelections>(AllCategory);
export const $equipmentDrawerHairColor = atom<HairColor>(HairColor.Black);
export const $equipmentDrawerFaceColor = atom<FaceColor>(FaceColor.Black);
export const $equipmentDrawerEquipCategorySelectionOpen = atom(true);

export const $equipmentDrawerSearch = map<
  Partial<Record<EquipCategorySelections, string>>
>({});

/* computed */
export const $isShowEquipCategorySelection = computed(
  $equipmentDrawerEquipTab,
  (tab) => tab === EquipTab.Equip,
);
export const $currentEquipmentDrawerCategory = computed(
  [$equipmentDrawerEquipCategory, $equipmentDrawerEquipTab],
  (category, tab) => {
    if (tab === EquipTab.Hair) {
      return 'Hair';
    }
    if (tab === EquipTab.Face) {
      return 'Face';
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
    if (category === AllCategory) {
      return strings;
    }
    if (category === 'Hair') {
      return strings.filter((item) => {
        if (item.category === EquipCategory.Hair) {
          return getHairColorId(item.id).toString() === HairColor.Black;
        }
        return false;
      });
    }

    if (category === 'Face') {
      return strings.filter((item) => {
        if (item.category === EquipCategory.Face) {
          return getFaceColorId(item.id).toString() === FaceColor.Black;
        }
        return false;
      });
    }

    const mainCategory = getCategoryBySubCategory(category);
    return strings.filter((item) => {
      if (item.category === mainCategory) {
        return getSubCategory(item.id) === category;
      }
      return false;
    });
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
