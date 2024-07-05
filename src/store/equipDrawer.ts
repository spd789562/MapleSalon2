import { atom, map, computed, onSet } from 'nanostores';

import { $equipmentStrings, $equipmentHistory } from './string';

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

/** enable character rendering featering in equipment drawer */
export const $equipmentDrawerExperimentCharacterRender = atom(false);

/* effect */
onSet($equipmentDrawerEquipTab, () => {
  if ($equipmentDrawerEquipCategorySelectionOpen.get()) {
    $equipmentDrawerEquipCategorySelectionOpen.set(false);
  }
});

/* computed */
export const $isShowEquipCategorySelection = computed(
  $equipmentDrawerEquipTab,
  (tab) => tab === EquipTab.Equip,
);
export const $isShowExperimentCharacterRenderSwitch = computed(
  $equipmentDrawerEquipTab,
  (tab) => tab === EquipTab.Face || tab === EquipTab.Hair,
);
export const $isOnHistoryTab = computed(
  $equipmentDrawerEquipTab,
  (tab) => tab === EquipTab.History,
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
    if (tab === EquipTab.History) {
      return AllCategory;
    }
    return category;
  },
);
export const $currentEquipmentDrawerSearch = computed(
  [$currentEquipmentDrawerCategory, $equipmentDrawerSearch],
  (category, search) => (search[category] as EquipCategorySelections) || '',
);

export const $categoryFilteredString = computed(
  [
    $equipmentDrawerEquipTab,
    $currentEquipmentDrawerCategory,
    $equipmentStrings,
  ],
  (tab, category, strings) => {
    if (tab === EquipTab.History) {
      /* not subscribe $equipmentHistory here */
      return $equipmentHistory.get();
    }

    if (tab === EquipTab.Hair) {
      return strings.filter((item) => {
        if (item.category === EquipCategory.Hair) {
          return getHairColorId(item.id).toString() === HairColor.Black;
        }
        return false;
      });
    }

    if (tab === EquipTab.Face) {
      return strings.filter((item) => {
        if (item.category === EquipCategory.Face) {
          return getFaceColorId(item.id).toString() === FaceColor.Black;
        }
        return false;
      });
    }

    if (category === AllCategory) {
      return strings;
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
