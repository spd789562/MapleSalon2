import { defineRecipe } from '@pandacss/dev';

export const topBarPositioner = defineRecipe({
  className: 'top-bar-positioner',
  base: {
    position: 'absolute',
    mx: 'auto',
    top: 0,
    left: 0,
    right: 0,
    w: 'min-content',
    zIndex: 'toast',
    display: 'flex',
    justifyContent: 'center',
    '& svg': {
      marginLeft: 'auto',
      transition: 'transform 0.5s ease',
    },
    _open: {
      animation: 'top-bar-in-top',
      '& svg': {
        transform: 'rotate(180deg)',
      },
    },
    _close: {
      '& svg': {
        transitionDuration: '0.3s',
      },
      animation: 'top-bar-out-top',
    },
  },
});
