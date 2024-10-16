import type { RecipeConfig, SlotRecipeConfig } from '@pandacss/dev';

import { cssTooltip } from './cssTooltip.recipe';
import { topBarToggle } from './topBarToggle.recipe';
import { topBarPositioner } from './topBarPositioner.recipe';

export const recipes: Record<string, Partial<RecipeConfig>> = {
  button: {
    jsx: ['Button', /.*Button$/],
    staticCss: [{ variant: ['*'] }],
  },
  iconButton: {
    jsx: ['IconButton', /.*IconButton$/],
    staticCss: [{ variant: ['*'] }],
  },
  cssTooltip,
  topBarToggle,
  topBarPositioner,
};

export const slotRecipes: Record<string, Partial<SlotRecipeConfig>> = {
  clipboard: {
    jsx: ['Clipboard', /.*Clipboard$/],
  },
  progress: {
    jsx: ['Progress', /.*Progress$/],
    staticCss: ['*'],
  },
  colorPicker: {
    jsx: ['ColorPicker', /.*ColorPicker$/],
  },
  menu: {
    jsx: ['Menu', /.*Menu$/],
  },
  tooltip: {
    jsx: ['Tooltip', /.*Tooltip$/],
  },
  select: {
    jsx: ['Select', /.*Select$/],
  },
  segmentGroup: {
    jsx: ['SegmentGroup', /.*SegmentGroup$/],
  },
  toggleGroup: {
    jsx: ['ToggleGroup', /.*ToggleGroup$/],
    variants: {
      size: {
        xs: {
          item: {
            height: '6',
            minWidth: '9',
            fontSize: 'xs',
            lineHeight: '1rem',
            gap: 2,
          },
        },
      },
    },
  },
  toast: {
    jsx: ['Toast', /.*Toast$/],
    staticCss: [{ variant: ['*'] }],
    variants: {
      variant: {
        error: {
          root: {
            border: '2px solid',
            borderColor: 'tomato.9',
          },
        },
        success: {
          root: {
            border: '2px solid',
            borderColor: 'grass.9',
          },
        },
        info: {
          root: {
            border: 'none',
          },
        },
        loading: {
          root: {
            border: '2px solid',
            borderColor: 'gray.9',
          },
        },
      },
    },
  },
  drawer: {
    jsx: ['Drawer', /.*Drawer$/],
    variants: {
      variant: {
        top: {
          positioner: {
            left: 0,
            right: 0,
            mx: 'auto',
            alignItems: 'flex-start',
          },
          content: {
            _open: {
              animation: 'drawer-in-top',
            },
            _close: {
              animation: 'drawer-out-top',
            },
          },
        },
      },
    },
  },
  numberInput: {
    defaultVariants: {
      size: 'sm',
    },
    variants: {
      size: {
        sm: {
          control: {
            ps: '2',
            h: '9',
            minW: '8',
            fontSize: 'sm',
          },
          label: {
            textStyle: 'sm',
          },
        },
      },
    },
  },
};
