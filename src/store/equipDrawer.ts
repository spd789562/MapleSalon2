import { atom, map, computed, onSet } from 'nanostores';

import { $equipmentStrings } from './string';
import { $equipmentHistory, saveHistory } from './equipHistory';

import {
  getCategoryBySubCategory,
  getSubCategory,
  Gender,
  getGender,
} from '@/utils/itemId';
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
  Favorite = 'favorite',
}

export enum EquipListType {
  Icon = 'icon',
  Row = 'row',
  Character = 'character',
}

export type EquipCategorySelections = EquipSubCategory | typeof AllCategory;

export const $equipmentDrawerEquipTab = atom<EquipTab>(EquipTab.Equip);
export const $equipmentDrawerEquipListType = atom<EquipListType>(
  EquipListType.Icon,
);
export const $equipmentDrawerEquipCategory =
  atom<EquipCategorySelections>(AllCategory);
export const $equipmentDrawerOnlyShowDyeable = atom(false);
export const $equipmentDrawerOnlyShowCash = atom(false);
export const $equipmentDrawerGender = atom<Gender>(Gender.All);
export const $equipmentDrawerHairColor = atom<HairColor>(HairColor.Black);
export const $equipmentDrawerFaceColor = atom<FaceColor>(FaceColor.Black);
export const $equipmentDrawerEquipCategorySelectionOpen = atom(false);

export const $equipmentDrawerSearch = map<
  Partial<Record<EquipCategorySelections, string>>
>({});

/** enable character rendering feater in equipment drawer */
export const $equipmentDrawerExperimentCharacterRender = atom(false);

/* effect */
onSet($equipmentDrawerEquipTab, () => {
  if ($equipmentDrawerEquipCategorySelectionOpen.get()) {
    $equipmentDrawerEquipCategorySelectionOpen.set(false);
  }
  const prev = $equipmentDrawerEquipTab.get();
  if (prev === EquipTab.History) {
    try {
      saveHistory();
    } catch (_) {
      console.error('Failed to save history');
    }
  }
});

/* computed */
export const $isFavoriteTab = computed(
  $equipmentDrawerEquipTab,
  (tab) => tab === EquipTab.Favorite,
);
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
    $equipmentDrawerOnlyShowDyeable,
    $equipmentDrawerOnlyShowCash,
  ],
  (tab, category, strings, onlyShowDyeable, onlyShowCash) => {
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

    if (
      category === 'NameTag' ||
      category === 'ChatBalloon' ||
      category === 'NickTag' ||
      category === 'Medal'
    ) {
      const mainCategory = getCategoryBySubCategory(category);
      return strings.filter((item) => item.category === mainCategory);
    }

    let filteredStrings = strings;

    if (category !== AllCategory) {
      const mainCategory = getCategoryBySubCategory(category);
      filteredStrings = strings.filter((item) => {
        if (item.category === mainCategory) {
          return getSubCategory(item.id) === category;
        }
        return false;
      });
    }

    if (onlyShowDyeable) {
      filteredStrings = filteredStrings.filter(({ isDyeable }) => isDyeable);
    }

    if (onlyShowCash) {
      filteredStrings = filteredStrings.filter(({ isCash }) => isCash);
    }

    return filteredStrings;
  },
);

export const $equipmentDrawerEquipFilteredString = computed(
  [
    $categoryFilteredString,
    $currentEquipmentDrawerSearch,
    $equipmentDrawerGender,
  ],
  (strings, searchKey, gender) => {
    const genderFilterd =
      gender === Gender.All
        ? strings
        : strings.filter((item) => getGender(item.id) === gender);

    if (searchKey) {
      const lowerCaseSearchKey = searchKey.toLowerCase();
      return genderFilterd.filter((item) => {
        const isMatch =
          item.name.toLowerCase().includes(lowerCaseSearchKey) ||
          item.id.toString() === searchKey;
        return isMatch;
      });
    }
    return genderFilterd;
  },
);
