import { atom, deepMap, computed, onSet } from 'nanostores';

import { getSubCategory } from '@/utils/itemId';

import type { EquipSubCategory } from '@/const/equipments';
import type { ItemInfo } from '@/renderer/character/const/data';

export type CharacterItems = Record<
  EquipSubCategory,
  ItemInfo & Partial<{ isDeleted: boolean }>
>;

export interface CharacterData extends Record<string, unknown> {
  items: Partial<CharacterItems>;
  frame?: number;
  isAnimating: boolean;
}

export const $currentCharacter = deepMap<CharacterData>({
  items: {
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
  },
  frame: 0,
  isAnimating: false,
});

export const $currentItem = atom<
  | {
      id: number;
      name: string;
    }
  | undefined
>(undefined);

onSet($currentItem, ({ newValue, abort }) => {
  if (!newValue) {
    return abort();
  }
  const category = getSubCategory(newValue.id);
  if (!category) {
    return abort();
  }

  if ($currentItemChanges.get()[category]) {
    $currentItemChanges.setKey(`${category}.id`, newValue.id);
  } else {
    $currentItemChanges.setKey(category, { id: newValue.id });
  }
});

export const $currentItemChanges = deepMap<
  Partial<CharacterItems & Record<string, unknown>>
>({});

export const $previewCharacter = computed(
  [$currentCharacter, $currentItemChanges],
  (ch, changes) => {
    const items = getUpdateItems(ch.items, changes);
    return {
      ...ch,
      items,
    };
  },
);

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
  const category = getSubCategory(id);
  return computed($currentItemChanges, (changes) => {
    if (!category) {
      return null;
    }
    return { item: (changes[category] || {}) as ItemInfo, category };
  });
}

export function applyCharacterChanges() {
  $currentCharacter.set($previewCharacter.get());
  $currentItemChanges.set({});
}
