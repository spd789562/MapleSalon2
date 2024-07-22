import { defineConfig } from '@pandacss/dev';
import { createPreset } from '@park-ui/panda-preset';

/* custom recripe */
import { tokens } from './src/recipes/tokens';
import { keyframes } from './src/recipes/keyframes';
import { recipes, slotRecipes } from './src/recipes/recipes';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  presets: [
    '@pandacss/preset-base',
    createPreset({
      accentColor: 'iris',
      grayColor: 'neutral',
      borderRadius: 'sm',
      additionalColors: ['tomato', 'grass', 'iris'],
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

  conditions: {},

  // Useful for theme customization
  theme: {
    extend: {
      tokens,
      slotRecipes,
      recipes,
      keyframes,
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
