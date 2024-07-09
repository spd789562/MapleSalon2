import type { RecipeConfig, SlotRecipeConfig } from '@pandacss/dev';

import { cssTooltip } from './cssTooltip.recipe';
import { topBarToggle } from './topBarToggle.recipe';
import { topBarPositioner } from './topBarPositioner.recipe';

export const recipes: Record<string, Partial<RecipeConfig>> = {
  button: {
    jsx: ['Button', /.*Button$/],
  },
  cssTooltip,
  topBarToggle,
  topBarPositioner,
};

export const slotRecipes: Record<string, Partial<SlotRecipeConfig>> = {
  tooltip: {
    jsx: ['Tooltip', /.*Tooltip$/],
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
