import { atom, deepMap, computed, onSet } from 'nanostores';

import { getSubCategory } from '@/utils/itemId';

import type { EquipSubCategory } from '@/const/equipments';
import type { ItemInfo } from '@/renderer/character/const/data';

export type CharacterItems = Record<EquipSubCategory, ItemInfo>;

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
    const items = { ...ch.items, ...changes };
    return {
      ...ch,
      items,
    };
  },
);

export function createGetItemChangeById(id: number) {
  return computed($currentItemChanges, (changes) => {
    const category = getSubCategory(id);
    if (!category) {
      return null;
    }
    return { item: (changes[category] || {}) as ItemInfo, category };
  });
}

export function applyCharacterChanges() {
  const changes = $currentItemChanges.get();
  const currentCharacter = $currentCharacter.get();
  $currentCharacter.set({
    ...currentCharacter,
    items: {
      ...currentCharacter.items,
      ...changes,
    },
  });
  $currentItemChanges.set({});
}
