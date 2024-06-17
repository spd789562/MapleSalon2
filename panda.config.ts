import { defineConfig } from '@pandacss/dev';
import { createPreset } from '@park-ui/panda-preset';

/* custom recripe */
import { cssTooltipRecripe } from './src/recripes/cssTooltip.recripe';

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
      recipes: {
        cssTooltip: cssTooltipRecripe,
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',
});
