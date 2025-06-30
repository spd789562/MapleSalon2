import { defineRecipe } from '@pandacss/dev';

export const topBarToggle = defineRecipe({
  className: 'top-bar-toggle',
  base: {
    alignItems: 'center',
    appearance: 'none',
    borderBottomRadius: 'l2',
    cursor: 'pointer',
    display: 'inline-flex',
    fontWeight: 'semibold',
    justifyContent: 'center',
    outline: 'none',
    background: 'bg.default',
    color: 'fg.default',
    colorPalette: 'colorPalette',
    transitionDuration: 'normal',
    transitionProperty: 'background, border-color, color, box-shadow',
    transitionTimingFunction: 'default',
    userSelect: 'none',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
    h: '9',
    minW: '40',
    textStyle: 'sm',
    px: '3.5',
    gap: '2',
    /* default button style end */
    boxShadow: 'md',

    _hidden: {
      display: 'none',
    },
    _hover: {
      color: 'colorPalette.emphasized',
    },
    _focusVisible: {
      outline: '2px solid',
      outlineColor: 'colorPalette.default',
      outlineOffset: '2px',
    },
    _disabled: {
      color: 'fg.disabled',
      background: 'bg.disabled',
      cursor: 'not-allowed',
      _hover: {
        color: 'fg.disabled',
        background: 'bg.disabled',
      },
    },
  },
});
