import { styled } from 'styled-system/jsx/factory';
import { Flex } from 'styled-system/jsx/flex';

export const IconContainer = styled(Flex, {
  base: {
    p: '1',
    width: '9',
    height: '9',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'fg.muted',
    borderRadius: 'md',
  },
  variants: {
    gender: {
      0: {
        backgroundColor: 'iris.a4',
      },
      1: {
        backgroundColor: 'tomato.a4',
      },
      2: {
        backgroundColor: 'transparent',
      },
      3: {
        backgroundColor: 'transparent',
      },
    },
  },
});

export const IconImage = styled('img', {
  base: {
    maxHeight: '100%',
  },
  variants: {
    fill: {
      true: {
        width: '100%',
        height: '100%',
        maxHeight: 'unset',
        objectFit: 'contain',
        imageRendering: 'pixelated',
      },
    },
  },
});
