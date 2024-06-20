import { defineKeyframes } from '@pandacss/dev';

export const keyframes = defineKeyframes({
  rotate: {
    '0%': {
      transform: 'rotate(0deg)',
    },
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
});