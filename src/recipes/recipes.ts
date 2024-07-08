import type { RecipeConfig, SlotRecipeConfig } from '@pandacss/dev';

import { cssTooltipRecipe } from './cssTooltip.recipe';

export const recipes: Record<string, Partial<RecipeConfig>> = {
  cssTooltipRecipe,
};

export const slotRecipes: Record<string, Partial<SlotRecipeConfig>> = {
  tooltip: {
    jsx: ['Tooltip', /.*Tooltip$/],
  },
  drawer: {
    jsx: ['Drawer', /.*Drawer$/],
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
