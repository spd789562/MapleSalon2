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
      // hair
      id: 47046,
    },
    // {
    //   // hat half cover
    //   id: 1006105,
    // },
    {
      //  hat full cover
      id: 1000003,
    },
    {
      // face accessory
      id: 1012764,
    },
    {
      // glass/eye accessory
      id: 1022285,
    },
    {
      // earring
      id: 1032331,
    },
    {
      // overall
      id: 1053576,
    },
    {
      // shoe
      id: 1073273,
    },
    {
      // cap
      id: 1103580,
    },
    {
      // weapon
      id: 1703339,
    },
  ],
  frame: 0,
  isAnimating: false,
});
