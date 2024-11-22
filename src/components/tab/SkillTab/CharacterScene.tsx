import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { $currentScene } from '@/store/character/store';
import { $sceneCustomColorStyle } from '@/store/character/selector';

import { useSkillTab } from './SkillTabContext';

import { LoadingWithBackdrop } from '@/components/elements/LoadingWithBackdrop';
import { CharacterPreviewView } from './CharacterPreview';
import { CharacterSceneSelection } from '@/components/CharacterPreview/CharacterSceneSelection';
import { ZoomControl } from '@/components/tab/ChairTab/ZoomControl';

import { PreviewSceneBackground } from '@/const/scene';

export const CharacterScene = () => {
  const [state, actions] = useSkillTab();
  let containerRef!: HTMLDivElement;
  const scene = useStore($currentScene);
  const customColorStyle = useStore($sceneCustomColorStyle);

  function handleLoad() {
    actions.setIsLoading(true);
  }
  function handleLoaded() {
    actions.setIsLoading(false);
  }

  return (
    <CharacterSceneContainer
      ref={containerRef}
      bgType={scene()}
      style={customColorStyle()}
    >
      <CharacterPreviewView
        onLoad={handleLoad}
        onLoaded={handleLoaded}
        target="preview"
      />
      <BottomLeftTool>
        <ZoomControl />
      </BottomLeftTool>
      <CharacterSceneSelection />
      <Show when={state.isLoading}>
        <LoadingWithBackdrop />
      </Show>
    </CharacterSceneContainer>
  );
};

const CharacterSceneContainer = styled('div', {
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
      henesys: {
        ...PreviewSceneBackground.henesys,
        backgroundRepeat: 'repeat-x',
        backgroundPositionY: '-20px',
      },
    },
  },
});

const BottomLeftTool = styled('div', {
  base: {
    position: 'absolute',
    bottom: 1,
    left: 1,
    p: 1,
    borderRadius: 'md',
    boxShadow: 'md',
    backgroundColor: 'bg.default',
    opacity: 0.6,
    transition: 'opacity 0.2s',
    _hover: {
      opacity: 1,
    },
  },
});
