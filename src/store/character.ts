import { atom } from 'nanostores';

import type { ItemInfo } from '@/renderer/character/const/data';

export interface CharacterData {
  items: ItemInfo[];
  frame?: number;
  isAnimating: boolean;
}

export const $currentCharacter = atom<CharacterData>({
  items: [
    {
      id: 2000,
    },
    {
      id: 12000,
    },
    {
      id: 20001,
    },
    {
      id: 47046,
    },
    // {
    //   // half cover
    //   id: 1006105,
    // },
    {
      // full cover
      id: 1000003,
    },
    {
      id: 1053576,
    },
    {
      id: 1073273,
    },
    {
      id: 1103580,
    },
    {
      id: 1703339,
    },
  ],
  frame: 0,
  isAnimating: false,
});
