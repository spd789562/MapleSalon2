import { atom, deepMap, computed, batched, onSet, map } from 'nanostores';

import { appendHistory } from './string';

import { getSubCategory, getBodyId, getHeadIdFromBodyId } from '@/utils/itemId';

import { EquipCategory, type EquipSubCategory } from '@/const/equipments';
import type { ItemInfo } from '@/renderer/character/const/data';
import { CharacterAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterEarType } from '@/const/ears';
import { CharacterHandType } from '@/const/hand';

export type CharacterItemInfo = ItemInfo &
  Partial<{ isDeleted: boolean; isDeleteDye: boolean; name: string }>;

export type CharacterItems = Record<EquipSubCategory, CharacterItemInfo>;

export interface CharacterInfo {
  frame: number;
  isAnimating: boolean;
  action: CharacterAction;
  expression: CharacterExpressions;
  earType: CharacterEarType;
  handType: CharacterHandType;
}

export interface CharacterData extends Record<string, unknown>, CharacterInfo {
  items: Partial<CharacterItems>;
}

export const $currentCharacterItems = deepMap<Partial<CharacterItems>>({
  Head: {
    id: 2000,
  },
  Body: {
    id: 12000,
  },
  Face: {
    id: 56772,
    dye: {
      color: 6,
      alpha: 50,
    },
  },
  Hair: {
    id: 47046,
    dye: {
      color: 0,
      alpha: 50,
    },
  },
  Cap: {
    // hat half cover
    id: 1006105,
  },
  // Cap: {
  //   //  hat full cover
  //   id: 1000003,
  // },
  'Face Accessory': {
    id: 1012764,
  },
  'Eye Decoration': {
    id: 1022285,
  },
  Earrings: {
    id: 1032331,
  },
  Overall: {
    id: 1053576,
  },
  Shoes: {
    id: 1073273,
  },
  Cape: {
    id: 1103580,
  },
  Weapon: {
    id: 1703024,
    hue: 0,
    saturation: 0,
    brightness: 0,
  },
});

export const $currentCharacterInfo = map({
  frame: 0,
  isAnimating: false,
  action: CharacterAction.Stand1,
  expression: CharacterExpressions.Default,
  earType: CharacterEarType.HumanEar,
  handType: CharacterHandType.SingleHand,
});

export const $currentCharacter = batched(
  [$currentCharacterItems, $currentCharacterInfo],
  (items, info) => {
    return {
      items,
      ...info,
    } as CharacterData;
  },
);

export const $currentItem = atom<
  | {
      id: number;
      name: string;
    }
  | undefined
>(undefined);

onSet($currentItem, ({ newValue, abort }) => {
  if (!newValue) {
    return;
  }
  let category = getSubCategory(newValue.id);
  if (!category) {
    return abort();
  }

  /* append to history */
  appendHistory({
    category: EquipCategory.Unknown,
    id: newValue.id,
    name: newValue.name,
  });

  category = getCharacterSubCategory(category);

  if (category === 'Skin') {
    updateChangesSkin(newValue);

    return abort();
  }

  addItemToChanges(category, newValue);
});

export const $currentItemChanges = deepMap<
  Partial<CharacterItems & Record<string, unknown>>
>({});

export const $totalItems = batched(
  [$currentCharacterItems, $currentItemChanges],
  getUpdateItems,
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

export function getCharacterSubCategory(category: EquipSubCategory) {
  if (category === 'CashWeapon') {
    return 'Weapon';
  }
  return category;
}

export function getUpdateItems(
  before: Partial<CharacterItems>,
  changes: Partial<CharacterItems>,
): Partial<CharacterItems> {
  const result: Partial<CharacterItems> = {};
  /* add not delete item to result  */
  for (const key in before) {
    const k = key as EquipSubCategory;
    const changeItem = changes[k];
    const isNotDeleted = !changes[k]?.isDeleted;
    if (isNotDeleted) {
      if (changeItem) {
        result[k] = {
          ...before[k],
          ...changes[k],
        } as ItemInfo & Partial<{ isDeleted: boolean }>;
      } else {
        result[k] = before[k];
      }
      const updated = result[k];
      if (updated?.isDeleteDye) {
        updated.dye = undefined;
      }
    }
  }
  /* add new item to result  */
  for (const key in changes) {
    const k = key as EquipSubCategory;
    const isNewItem = !before[k];
    if (isNewItem) {
      result[k] = changes[k] as ItemInfo;
    }
  }
  return result;
}

export function createGetItemChangeById(id: number) {
  const c = getSubCategory(id);
  const category = c && getCharacterSubCategory(c);
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

/* actions */
export function applyCharacterChanges() {
  $currentCharacterItems.set($currentItemChanges.get());
  $currentItemChanges.set({});
}

export function updateChangesSkin(item: {
  id: number;
  name: string;
}) {
  const bodyId = getBodyId(item.id);
  const headId = getHeadIdFromBodyId(bodyId);

  $currentItemChanges.setKey('Body.id', bodyId);
  $currentItemChanges.setKey('Body.name', item.name);

  $currentItemChanges.setKey('Head.id', headId);
  $currentItemChanges.setKey('Head.name', item.name);
}

export function addItemToChanges(
  category: EquipSubCategory,
  item: {
    id: number;
    name: string;
  },
) {
  if ($currentItemChanges.get()[category]) {
    $currentItemChanges.setKey(`${category}.id`, item.id);
    $currentItemChanges.setKey(`${category}.name`, item.name);
    $currentItemChanges.setKey(`${category}.isDeleted`, undefined);
  } else {
    $currentItemChanges.setKey(category, {
      id: item.id,
      name: item.name,
      isDeleted: false,
    });
  }
}
