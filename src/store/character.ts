import { atom, deepMap } from 'nanostores';

import type { ItemInfo } from '@/renderer/character/const/data';

export interface CharacterData extends Record<string, unknown> {
  items: ItemInfo[];
  frame?: number;
  isAnimating: boolean;
}

export const $currentCharacter = deepMap<CharacterData>({
  items: [
    {
      id: 2000,
    },
    {
      id: 12000,
    },
    {
      id: 56772,
      dye: {
        color: 6,
        alpha: 50,
      },
    },
    {
      // hair
      id: 47046,
      dye: {
        color: 0,
        alpha: 50,
      },
    },
    {
      // hat half cover
      id: 1006105,
    },
    // {
    //   //  hat full cover
    //   id: 1000003,
    // },
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
    // {
    //   // weapon
    //   id: 1703024,
    //   hue: 0,
    //   saturation: 0,
    //   brightness: 0,
    // },
    // {
    //   // weapon
    //   id: 1703017,
    //   hue: 0,
    //   saturation: 0,
    //   brightness: 0,
    // },
    {
      // weapon
      id: 1703126,
      hue: 297,
      saturation: -64,
      brightness: 54,
    },
    // {
    //   // weapon
    //   id: 1703126,
    //   hue: 71,
    //   saturation: 37,
    //   brightness: 59,
    // },
    // {
    //   // weapon
    //   id: 1703126,
    //   hue: 63,
    //   saturation: 84,
    //   brightness: 60,
    // },
    // {
    //   // weapon
    //   id: 1702858,
    //   hue: 160,
    //   saturation: 55,
    //   brightness: 66,
    // },
    // {
    //   // weapon
    //   id: 1702858,
    //   hue: 344,
    //   saturation: -42,
    //   brightness: -17,
    // },
  ],
  frame: 0,
  isAnimating: false,
});
