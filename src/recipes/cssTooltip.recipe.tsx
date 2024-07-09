import { defineRecipe } from '@pandacss/dev';

export const cssTooltip = defineRecipe({
  className: 'css-tooltip',
  jsx: ['CssTooltip'],
  base: {
    position: 'relative',
    _after: {
      content: 'attr(data-tooltip-content)',
      position: 'absolute',
      zIndex: '-1',
      top: '100%',
      left: '50%',
      background: 'gray.a12',
      borderRadius: 'l2',
      boxShadow: 'sm',
      color: 'bg.default',
      fontWeight: 'semibold',
      px: '2',
      py: '1',
      textStyle: 'xs',
      minWidth: '16',
      opacity: 0,
      pointerEvents: 'none',
      transform: 'translate(-50%, -50%)',
      transitionProperty: 'opacity, transform',
      transitionDuration: '0.2s',
      transitionTimingFunction: 'ease-out',
      _hover: {
        zIndex: '1',
        opacity: 1,
        transform: 'translate(-50%, -55%)',
      },
    },
  },
  variants: {
    placement: {
      center: {
        _after: {
          transform: 'translate(-50%, -50%)',
          _hover: {
            transform: 'translate(-50%, -55%)',
          },
        },
      },
      right: {
        _after: {
          left: 0,
          transform: 'translate(0, -50%)',
          _hover: {
            transform: 'translate(0, -55%)',
          },
        },
      },
      left: {
        _after: {
          right: 0,
          transform: 'translate(-100%, -50%)',
          _hover: {
            transform: 'translate(-100%, -55%)',
          },
        },
      },
    },
  },
  defaultVariants: {
    placement: 'center',
  },
});
