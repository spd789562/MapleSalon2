import { computed, batched } from 'nanostores';

import {
  type CharacterData,
  $currentCharacterInfo,
  $currentCharacterItems,
  $currentItemChanges,
} from './store';
import { getUpdateItems, getCharacterSubCategory } from './utils';

import { getSubCategory } from '@/utils/itemId';

import type { EquipSubCategory } from '@/const/equipments';
import type { ItemInfo } from '@/renderer/character/const/data';

export const $currentAction = computed(
  $currentCharacterInfo,
  (info) => info.action,
);
export const $currentExpression = computed(
  $currentCharacterInfo,
  (info) => info.expression,
);
export const $currentEarType = computed(
  $currentCharacterInfo,
  (info) => info.earType,
);
export const $currentHandType = computed(
  $currentCharacterInfo,
  (info) => info.handType,
);
export const $isAnimating = computed(
  $currentCharacterInfo,
  (info) => info.isAnimating,
);

export const $currentCharacter = batched(
  [$currentCharacterItems, $currentCharacterInfo],
  (items, info) => {
    return {
      items,
      ...info,
    } as CharacterData;
  },
);
export const $totalItems = batched(
  [$currentCharacterItems, $currentItemChanges],
  getUpdateItems,
);
export const $hasAnyItemChanges = computed(
  [$currentItemChanges],
  (items) => Object.keys(items).length > 0,
);
export const $previewCharacter = computed(
  [$currentCharacterInfo, $totalItems],
  (info, items) => {
    return {
      ...info,
      items,
    } as CharacterData;
  },
);

/* factory */
export function createGetItemChangeById(id: number) {
  const c = getSubCategory(id);
  let category = c && getCharacterSubCategory(c);
  if (category === 'Skin') {
    category = 'Head';
  }
  return computed($totalItems, (changes) => {
    if (!category) {
      return null;
    }
    return { item: (changes[category] || {}) as ItemInfo, category };
  });
}

export function createEquipItemByCategory(category: EquipSubCategory) {
  return computed($totalItems, (items) => items[category]);
}
