import { computed, batched } from 'nanostores';

import {
  type CharacterData,
  type CharacterItemInfo,
  $currentCharacterInfo,
  $currentCharacterItems,
  $currentItemChanges,
  $currentInfoChanges,
} from './store';
import { getUpdateItems, getCharacterSubCategory } from './utils';

import { getSubCategory } from '@/utils/itemId';

import type { EquipSubCategory } from '@/const/equipments';

import type { FaceColorId } from '@/const/face';
import type { HairColorId } from '@/const/hair';

import { getHairColorId, getFaceColorId } from '@/utils/mixDye';

export const $totalInfo = batched(
  [$currentCharacterInfo, $currentInfoChanges],
  (info, changes) => ({
    ...info,
    ...changes,
    extraParts:
      changes.extraParts && changes.extraParts.length > 0
        ? changes.extraParts
        : info.extraParts,
  }),
);

export const $currentCharacterId = computed(
  $currentCharacterInfo,
  (info) => info.id,
);
export const $currentAction = computed(
  $currentCharacterInfo,
  (info) => info.action,
);
export const $currentExpression = computed(
  $currentCharacterInfo,
  (info) => info.expression,
);
export const $isAnimating = computed(
  $currentCharacterInfo,
  (info) => info.isAnimating,
);
/* those it change and savable need to be merged */
export const $currentEarType = computed($totalInfo, (info) => info.earType);
export const $currentHandType = computed($totalInfo, (info) => info.handType);
export const $currentName = computed($totalInfo, (info) => info.name);
export const $currentNameTagId = computed($totalInfo, (info) => info.nameTagId);
export const $currentChatBalloonId = computed(
  $totalInfo,
  (info) => info.chatBalloonId,
);
export const $showNameTag = computed($totalInfo, (info) => !!info.showNameTag);
export const $showChatBalloon = computed(
  $totalInfo,
  (info) => !!info.showChatBalloon,
);
export const $currentMedalId = computed($totalInfo, (info) => info.medalId);
export const $currentNickTagId = computed($totalInfo, (info) => info.nickTagId);

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
export const $previewCharacter = computed(
  [$totalInfo, $totalItemsApplyDeletion],
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
export function getHasAnyChanges() {
  return (
    Object.keys($currentItemChanges.get()).length > 0 ||
    Object.keys($currentInfoChanges.get()).length > 0
  );
}
