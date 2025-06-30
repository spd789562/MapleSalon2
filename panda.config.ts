import { defineConfig } from '@pandacss/dev';
import { createPreset } from '@park-ui/panda-preset';

/* custom recripe */
import { presetConfig } from './src/recipes/colors';
import { tokens, semanticTokens } from './src/recipes/tokens';
import { keyframes } from './src/recipes/keyframes';
import { recipes, slotRecipes } from './src/recipes/recipes';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  presets: [
    '@pandacss/preset-base',
    createPreset({
      accentColor: presetConfig.accentColor,
      grayColor: presetConfig.grayColor,
      radius: 'sm',
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
    containerNames: ['actionHeader'],
    containerSizes: {
      actionHeaderXs: '200px',
      actionHeaderSm: '300px',
      xs: '40rem',
      sm: '60rem',
      md: '80rem',
    },
    extend: {
      tokens,
      semanticTokens,
      slotRecipes,
      recipes,
      keyframes,
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
