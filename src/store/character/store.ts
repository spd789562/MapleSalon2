import { atom, deepMap } from 'nanostores';

import type { EquipSubCategory } from '@/const/equipments';
import type { ItemInfo } from '@/renderer/character/const/data';
import { CharacterAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterEarType } from '@/const/ears';
import { CharacterHandType } from '@/const/hand';
import type { CharacterExtraPart } from '@/const/extraParts';
import { TagVersion } from '@/const/setting/tagVersion';

export type CharacterItemInfo = ItemInfo &
  Partial<{
    isDeleted: boolean;
    isDeleteDye: boolean;
    name: string;
  }>;

export type CharacterItems = Record<EquipSubCategory, CharacterItemInfo>;

export interface CharacterInfo {
  id?: string;
  name?: string;
  nameTagId?: number;
  chatBalloonId?: number;
  showNameTag: boolean;
  showChatBalloon: boolean;
  medalId?: number | null;
  nickTagId?: number | null;
  frame: number;
  isAnimating: boolean;
  action: CharacterAction;
  expression: CharacterExpressions;
  earType: CharacterEarType;
  handType: CharacterHandType;
  skillId?: string;
  extraParts?: CharacterExtraPart[];
  tagVersion: TagVersion;
}

export interface CharacterData extends Record<string, unknown>, CharacterInfo {
  items: Partial<CharacterItems>;
}

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

export const $currentCharacterInfo = deepMap<
  CharacterInfo & Record<string, unknown>
>({
  id: 'default',
  name: 'default',
  frame: 0,
  nameTagId: undefined,
  chatBalloonId: undefined,
  showNameTag: true,
  showChatBalloon: false,
  isAnimating: true,
  action: CharacterAction.Stand1,
  expression: CharacterExpressions.Default,
  earType: CharacterEarType.HumanEar,
  handType: CharacterHandType.SingleHand,
  skillId: undefined,
  extraParts: [] as CharacterExtraPart[],
  tagVersion: TagVersion.V2,
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

export const $currentInfoChanges = deepMap<Partial<CharacterInfo>>({});

export const $chatBalloonContent = atom<string>('');

export const $characterExtraParts = atom<
  {
    part: CharacterExtraPart;
    disabled: boolean;
  }[]
>([]);
