import { defineTokens } from '@pandacss/dev';

export const animations = defineTokens.animations({
  'top-bar-in-top': {
    value: 'slide-bar-in-top 400ms {easings.emphasized-in} forwards',
  },
  'top-bar-out-top': {
    value: 'slide-bar-out-top 200ms {easings.emphasized-out}',
  },
  'drawer-in-top': {
    value: 'slide-in-top 400ms {easings.emphasized-in}',
  },
  'drawer-out-top': {
    value: 'slide-out-top 200ms {easings.emphasized-out}',
  },
});
