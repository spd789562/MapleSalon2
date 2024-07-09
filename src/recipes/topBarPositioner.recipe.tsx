import { defineRecipe } from '@pandacss/dev';

export const topBarPositioner = defineRecipe({
  className: 'top-bar-positioner',
  base: {
    position: 'fixed',
    mx: 'auto',
    top: 0,
    left: 0,
    right: 0,
    w: { base: 'full', md: '50%' },
    zIndex: 'modal',
    display: 'flex',
    justifyContent: 'center',
    '& svg': {
      marginLeft: 'auto',
      transition: 'transform 0.3s ease',
    },
    _open: {
      animation: 'top-bar-in-top',
      '& svg': {
        transform: 'rotate(180deg)',
      },
    },
    _close: {
      animation: 'top-bar-out-top',
    },
  },
});
