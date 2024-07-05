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

  // pregenerate
  staticCss: {
    themes: ['light', 'dark'],
  },

  conditions: {
    extend: {
      dark: '.dark &, [data-theme="dark"] &',
      light: '.light &',
    },
  },

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
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
      },
      slotRecipes: {
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
