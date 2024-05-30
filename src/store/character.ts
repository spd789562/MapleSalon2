import { atom } from 'nanostores';

import type { ItemInfo } from '@/renderer/character/models';

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
    {
      id: 1006105,
    },
  ],
  frame: 0,
  isAnimating: false,
});
