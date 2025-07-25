// from https://github.com/chakra-ui/ark/blob/main/website/src/theme/recipes/tour.ts
import { defineSlotRecipe } from '@pandacss/dev';

export const tour = defineSlotRecipe({
  className: 'tour',
  jsx: ['Tour', /.*Tour$/],
  slots: [
    'actionTrigger',
    'arrow',
    'arrowTip',
    'backdrop',
    'closeTrigger',
    'content',
    'control',
    'description',
    'positioner',
    'progressText',
    'spotlight',
    'title',
  ],
  base: {
    arrow: {
      '--arrow-size': 'var(--sizes-3)',
      '--arrow-background': 'var(--colors-bg-default)',
    },
    arrowTip: {
      borderTopWidth: '1px',
      borderLeftWidth: '1px',
    },
    backdrop: {
      backdropFilter: 'blur(1px)',
      zIndex: 'tourModal',
      background: {
        _light: 'black.a6',
        _dark: 'black.a6',
      },
      _open: {
        animation: 'backdrop-in',
      },
      _closed: {
        animation: 'backdrop-out',
      },
    },
    closeTrigger: {
      position: 'absolute',
      top: '3',
      right: '3',
    },
    content: {
      position: 'relative',
      background: 'bg.default',
      borderRadius: 'l3',
      boxShadow: 'lg',
      display: 'flex',
      flexDirection: 'column',
      minWidth: 'sm',
      maxWidth: 'md',
      p: '5',
      whiteSpace: 'pre-line',
    },
    control: {
      display: 'flex',
      gap: '3',
      justifyContent: 'flex-end',
    },
    description: {
      color: 'fg.muted',
      textStyle: 'sm',
    },
    positioner: {
      alignItems: 'center',
      display: 'flex',
      justifyContent: 'center',
      zIndex: 'tourModal!',
      "&[data-type='dialog']": {
        inset: 0,
        position: 'fixed',
      },
      '&[data-type="tooltip"]': {
        position: 'absolute',
      },
    },
    progressText: {
      textStyle: 'sm',
      color: 'fg.muted',
    },
    spotlight: {
      borderWidth: '3px',
      borderStyle: 'solid',
      borderColor: 'accent.emphasized',
      zIndex: 'tourModal',
    },
    title: {
      fontWeight: 'medium',
      textStyle: 'lg',
    },
  },
});
