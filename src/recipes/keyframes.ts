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
  'slide-in-top': {
    '0%': {
      transform: 'translateY(-100%)',
    },
    '100%': {
      transform: 'translateY(0)',
    },
  },
  'slide-out-top': {
    '0%': {
      transform: 'translateY(0)',
    },
    '100%': {
      transform: 'translateY(-100%)',
    },
  },
  'slide-bar-in-top': {
    '0%': {
      transform: 'translateY(0)',
    },
    '100%': {
      transform: 'translateY(9rem)',
    },
  },
  'slide-bar-out-top': {
    '0%': {
      transform: 'translateY(9rem)',
    },
    '100%': {
      transform: 'translateY(0)',
    },
  },
});
