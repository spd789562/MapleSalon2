import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { $currentScene } from '@/store/character';

import { CharacterAvatar } from '../Character';

export const CharacterScene = () => {
  const scene = useStore($currentScene);

  return (
    <CharacterSceneContainer bgType={scene()}>
      <CharacterAvatar />
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
        backgroundImage:
          'conic-gradient(white 90deg, #999 90deg, #999 180deg, white 180deg, white 270deg, #999 270deg, #999 360deg, white 360deg)',
        backgroundSize: '16px 16px',
        backgroundRepeat: 'repeat',
      },
      black: {
        backgroundColor: 'black',
        border: '1px solid',
        borderColor: 'border.muted',
      },
      white: {
        backgroundColor: 'white',
        border: '1px solid',
        borderColor: 'border.muted',
      },
    },
  },
});
