import { computed, batched } from 'nanostores';

import {
  type CharacterData,
  type CharacterItemInfo,
  $currentCharacterInfo,
  $currentCharacterItems,
  $currentItemChanges,
  $currentScene,
  $sceneCustomColor,
} from './store';
import { getUpdateItems, getCharacterSubCategory } from './utils';

import { getSubCategory } from '@/utils/itemId';

import type { EquipSubCategory } from '@/const/equipments';
import type { ItemInfo } from '@/renderer/character/const/data';

import { FaceColor, type FaceColorId } from '@/const/face';
import { HairColor, type HairColorId } from '@/const/hair';
import { PreviewScene } from '@/const/scene';

import { getHairColorId, getFaceColorId } from '@/utils/mixDye';

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
  (current, changes) => getUpdateItems(current, changes, false),
);
export const $totalItemsApplyDeletion = batched(
  [$currentCharacterItems, $currentItemChanges],
  getUpdateItems,
);

export const $hasAnyItemChanges = computed(
  [$currentItemChanges],
  (items) => Object.keys(items).length > 0,
);
export const $previewCharacter = computed(
  [$currentCharacterInfo, $totalItemsApplyDeletion],
  (info, items) => {
    return {
      ...info,
      items,
    } as CharacterData;
  },
);
export const $sceneCustomColorStyle = computed(
  [$currentScene, $sceneCustomColor],
  (scene, color) => {
    if (scene === PreviewScene.Color) {
      return {
        'background-color': color,
      };
    }
    return {};
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
    return { item: (changes[category] || {}) as CharacterItemInfo, category };
  });
}

export function createEquipItemByCategory(category: EquipSubCategory) {
  return computed($totalItems, (items) => items[category]);
}

/* functions */
export function getCurrentHairColor(): HairColorId {
  const hair = $totalItems.get().Hair;
  if (!hair) {
    return 0; // default hair color black
  }
  return getHairColorId(hair.id);
}
export function getCurrentFaceColor(): FaceColorId {
  const face = $totalItems.get().Face;
  if (!face) {
    return 0; // default face color black
  }
  return getFaceColorId(face.id);
}
