import type { Tokens } from '@pandacss/dev';
import { animations } from './animations';

export const tokens: Tokens = {
  animations,
  zIndex: {
    /* 
      park-ui default
        hide:  -1,
        base:  0,
        docked: 10,
        dropdown: 1000,
        sticky: 1100,
        banner: 1200,
        overlay: 1300,
        modal:  1400,
        popover: 1500,
        skipLink: 1600,
        toast:  1700,
        tooltip: 1800,
    */
    contextMenu: {
      value: 1900,
    },
    topDrawer: {
      value: 2000,
    },
    topDrawerContextMenu: {
      value: 2100,
    },
    settingOverlay: {
      value: 2200,
    },
    settingModal: {
      value: 2300,
    },
    confirmOverlay: {
      value: 2400,
    },
    confirmModal: {
      value: 2500,
    },
  },
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
