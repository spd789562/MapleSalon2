import { atom, map, computed } from 'nanostores';

import type { EquipItem } from './string';
import { fileStore } from './equipHistory';
import type { EquipCategorySelections } from './equipDrawer';

import {
  AllCategory,
  EquipCategory,
  type EquipSubCategory,
} from '@/const/equipments';
import { getCategoryBySubCategory, getSubCategory } from '@/utils/itemId';

const SAVE_KEY = 'favorite';

/** items recently select */
export const $equipmentFavorite = atom<EquipItem[]>([]);

export const $equipmentFavoriteEquipCategory =
  atom<EquipCategorySelections>(AllCategory);
export const $equipmentFavoriteEquipCategorySelectionOpen = atom(false);

export const $equipmentFavoriteSearch = map<
  Partial<Record<EquipCategorySelections, string>>
>({});

export async function initializeSavedEquipmentFavorite() {
  const favorites = await fileStore.get<EquipItem[] | undefined>(SAVE_KEY);
  if (favorites && Array.isArray(favorites) && favorites.length > 0) {
    const verifiedFavorite = favorites
      .map(validateEquipItem)
      .filter(Boolean) as EquipItem[];
    $equipmentFavorite.set(verifiedFavorite);
  }
}

export function appendFavoriteEquip(item: EquipItem) {
  const current = $equipmentFavorite.get().filter((e) => e.id !== item.id);
  const list = [...current, item];
  $equipmentFavorite.set(list);
  try {
    fileStore.set(SAVE_KEY, list);
  } catch (_) {
    console.error('Failed to save favorite');
  }
}

export function removeFavoriteEquip(item: EquipItem) {
  const current = $equipmentFavorite.get().filter((e) => e.id !== item.id);
  $equipmentFavorite.set(current);
  try {
    fileStore.set(SAVE_KEY, current);
  } catch (_) {
    console.error('Failed to save favorite');
  }
}

export function isFavoriteEquip(id: number) {
  return $equipmentFavorite.get().some((e) => e.id === id);
}

export function saveFavorite() {
  return fileStore.save();
}

/* util */
function validateEquipItem(item: EquipItem) {
  const returnItem = {} as EquipItem;
  if (!item) {
    return;
  }
  if (!item.id || typeof item.id !== 'number') {
    return;
  }
  returnItem.id = item.id;
  if (!item.name || typeof item.name !== 'string') {
    return;
  }
  returnItem.name = item.name;
  if (item.hasEffect) {
    returnItem.hasEffect = !!item.hasEffect;
  }
  if (item.isDyeable) {
    returnItem.isDyeable = !!item.isDyeable;
  }
  if (item.category) {
    returnItem.category = item.category;
  }
  if (item.isNameTag) {
    returnItem.category = EquipCategory.NameTag;
  }
  if (item.isChatBalloon) {
    returnItem.category = EquipCategory.ChatBalloon;
  }

  return returnItem;
}

/* selectors , it too long compare to action, so put it at bottom */
export const $currentEquipmentFavoriteSearch = computed(
  [$equipmentFavoriteEquipCategory, $equipmentFavoriteSearch],
  (category, search) => (search[category] as EquipCategorySelections) || '',
);

export const $categoryFilteredString = computed(
  [$equipmentFavoriteEquipCategory, $equipmentFavorite],
  (category, strings) => {
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

    return filteredStrings;
  },
);

export const $equipmentFavoriteEquipFilteredString = computed(
  [$categoryFilteredString, $currentEquipmentFavoriteSearch],
  (strings, searchKey) => {
    if (searchKey) {
      return strings.filter((item) => {
        const isMatch =
          item.name.includes(searchKey) || item.id.toString() === searchKey;
        return isMatch;
      });
    }
    return strings;
  },
);
