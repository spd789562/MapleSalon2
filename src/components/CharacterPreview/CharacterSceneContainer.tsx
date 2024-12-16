import type { JSX } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import {
  $currentScene,
  $sceneCustomStyle,
  $sceneBackgroundPosition,
  $sceneBackgroundRepeat,
} from '@/store/scene';

import { PreviewSceneBackground } from '@/const/scene';

export interface CharacterSceneContainerProps {
  children?: JSX.Element;
}
export const CharacterSceneContainer = (
  props: CharacterSceneContainerProps,
) => {
  const scene = useStore($currentScene);
  const customColorStyle = useStore($sceneCustomStyle);
  const customBackgroundPosition = useStore($sceneBackgroundPosition);
  const customBackgroundRepeat = useStore($sceneBackgroundRepeat);

  return (
    <Container
      bgType={scene()}
      style={{
        ...customColorStyle(),
        'background-position': customBackgroundPosition(),
        'background-repeat': customBackgroundRepeat(),
      }}
    >
      {props.children}
    </Container>
  );
};

const Container = styled('div', {
  base: {
    // py: 10,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 'lg',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  variants: {
    bgType: {
      alpha: {
        ...PreviewSceneBackground.alpha,
      },
      grid: {
        ...PreviewSceneBackground.grid,
      },
      color: {},
      mapleMap: {},
      henesys: {
        ...PreviewSceneBackground.henesys,
        backgroundRepeat: 'repeat-x',
        backgroundPositionY: '-20px',
      },
      custom: {
        ...PreviewSceneBackground.custom,
      },
    },
  },
});
