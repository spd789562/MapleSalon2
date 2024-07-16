import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { $currentScene } from '@/store/character';

import { CharacterAvatar } from '../Character';
import { CharacterSceneSelection } from './CharacterSceneSelection';
import { ShowPreviousSwitch } from './ShowPreviousSwitch';

import { PreviewSceneBackground } from '@/const/scene';

export const CharacterScene = () => {
  const scene = useStore($currentScene);

  return (
    <CharacterSceneContainer bgType={scene()}>
      <CharacterAvatar />
      <TopTool>
        <ShowPreviousSwitch />
      </TopTool>
      <CharacterSceneSelection />
    </CharacterSceneContainer>
  );
};

const CharacterSceneContainer = styled('div', {
  base: {
    py: 10,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 'lg',
    display: 'flex',
    justifyContent: 'center',
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

const TopTool = styled('div', {
  base: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    mx: 'auto',
    p: 2,
    opacity: 0.4,
    borderBottomRadius: 'md',
    transition: 'opacity 0.2s',
    backgroundColor: 'bg.default',
    boxShadow: 'md',
    _hover: {
      opacity: 1,
    },
  },
});
