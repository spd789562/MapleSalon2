import type { Tokens } from '@pandacss/dev';
import { animations } from './animations';

export const tokens: Tokens = {
  animations,
  assets: {
    henesysBackground: {
      type: 'string',
      value: 'url(/background/henesysType2.png)',
    },
  },
  gradients: {
    hue: {
      value:
        'linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
    },
    saturation: { value: 'linear-gradient(90deg, #999, #f00)' },
    brightness: { value: 'linear-gradient(90deg, #000, #fff)' },
    hueConic: {
      value:
        'conic-gradient(#f76e6e, #f7f76e, #6ef76e, #6ef7f7, #6e6ef7, #f76ef7, #f76e6e)',
    },
  },
};
