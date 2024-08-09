import { atom, deepMap, map } from 'nanostores';

import type { EquipSubCategory } from '@/const/equipments';
import type { ItemInfo } from '@/renderer/character/const/data';
import { CharacterAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterEarType } from '@/const/ears';
import { CharacterHandType } from '@/const/hand';
import { PreviewScene } from '@/const/scene';

export type CharacterItemInfo = ItemInfo &
  Partial<{ isDeleted: boolean; isDeleteDye: boolean; name: string }>;

export type CharacterItems = Record<EquipSubCategory, CharacterItemInfo>;

export interface CharacterInfo {
  id?: string;
  name?: string;
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

export const $currentScene = atom<PreviewScene>(PreviewScene.Color);

export const $sceneCustomColor = atom<string>('#FFFFFF');

let DefaultItems: Partial<CharacterItems> = {
  Head: {
    id: 2000,
  },
  Body: {
    id: 12000,
  },
};

if (import.meta.env.DEV) {
  DefaultItems = {
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
      enableEffect: true,
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
      enableEffect: true,
    },
    Overall: {
      id: 1054098,
    },
    Shoes: {
      id: 1073273,
    },
    Cape: {
      id: 1103642,
      enableEffect: true,
    },
    Weapon: {
      id: 1703369,
    },
  };
}

export const $currentCharacterItems =
  deepMap<Partial<CharacterItems>>(DefaultItems);

export const $currentCharacterInfo = map({
  id: 'default',
  name: 'default',
  frame: 0,
  isAnimating: true,
  action: CharacterAction.Stand1,
  expression: CharacterExpressions.Default,
  earType: CharacterEarType.HumanEar,
  handType: CharacterHandType.SingleHand,
});

export const $currentItem = atom<
  | {
      id: number;
      name: string;
    }
  | undefined
>(undefined);

export const $enableCharacterPreview = atom<boolean>(false);

export const $currentItemChanges = deepMap<
  Partial<CharacterItems & Record<string, unknown>>
>({});
