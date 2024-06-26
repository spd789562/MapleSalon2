import { defineConfig } from '@pandacss/dev';
import { createPreset } from '@park-ui/panda-preset';

/* custom recripe */
import { keyframes } from './src/recipes/keyframes';
import { cssTooltipRecipe } from './src/recipes/cssTooltip.recipe';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  presets: [
    '@pandacss/preset-base',
    createPreset({
      accentColor: 'iris',
      grayColor: 'neutral',
      borderRadius: 'sm',
    }),
  ],

  // Where to look for your css declarations
  include: ['./src/**/*.{js,jsx,ts,tsx}', './pages/**/*.{js,jsx,ts,tsx}'],

  // Files to exclude
  exclude: [],

  // create jsx preset
  jsxFramework: 'solid',

  // Useful for theme customization
  theme: {
    extend: {
      slotRecipes: {
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
      },
      recipes: {
        cssTooltip: cssTooltipRecipe,
      },
      keyframes: keyframes,
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
