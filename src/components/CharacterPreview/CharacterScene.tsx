import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { $currentScene } from '@/store/character';

import { CharacterAvatar } from '../Character';
import { CharacterSceneSelection } from './CharacterSceneSelection';

import { PreviewSceneBackground } from '@/const/scene';

export const CharacterScene = () => {
  const scene = useStore($currentScene);

  return (
    <CharacterSceneContainer bgType={scene()}>
      <CharacterAvatar />
      <CharacterSceneSelection />
    </CharacterSceneContainer>
  );
};

const CharacterSceneContainer = styled('div', {
  base: {
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 'lg',
  },
  variants: {
    bgType: {
      alpha: {
        ...PreviewSceneBackground.alpha,
      },
      black: {
        ...PreviewSceneBackground.black,
        border: '1px solid',
        borderColor: 'border.muted',
      },
      white: {
        ...PreviewSceneBackground.white,
        border: '1px solid',
        borderColor: 'border.muted',
      },
    },
  },
});
