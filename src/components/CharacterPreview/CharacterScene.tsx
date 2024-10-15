import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { $currentScene } from '@/store/character/store';
import {
  $currentCharacter,
  $previewCharacter,
  $sceneCustomColorStyle,
} from '@/store/character/selector';
import { $showPreviousCharacter } from '@/store/trigger';

import { useCharacterPreview } from './CharacterPreviewContext';

import ChevronRightIcon from 'lucide-solid/icons/chevron-right';
import { LoadingWithBackdrop } from '@/components/elements/LoadingWithBackdrop';
import { CharacterView } from './Character';
import { CharacterPreviewView } from './CharacterPreview';
import { CharacterSceneSelection } from './CharacterSceneSelection';
import { ShowPreviousSwitch } from './ShowPreviousSwitch';
import { ShowUpscaleSwitch } from './ShowUpscaleSwitch';
import { ZoomControl } from './ZoomControl';

import { PreviewSceneBackground } from '@/const/scene';

export const CharacterScene = () => {
  const [state, actions] = useCharacterPreview();
  let containerRef!: HTMLDivElement;
  const scene = useStore($currentScene);
  const customColorStyle = useStore($sceneCustomColorStyle);
  const isShowComparison = useStore($showPreviousCharacter);

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
      <Show when={isShowComparison()}>
        <CharacterView
          onLoad={handleLoad}
          onLoaded={handleLoaded}
          store={$currentCharacter}
          target="original"
        />
        <CompareSeparator>
          <ChevronRightIcon size={32} />
        </CompareSeparator>
      </Show>
      <CharacterPreviewView
        onLoad={handleLoad}
        onLoaded={handleLoaded}
        store={$previewCharacter}
        target="preview"
        ref={actions.setCharacterRef}
      />
      <TopTool>
        <ShowPreviousSwitch />
        <ShowUpscaleSwitch />
      </TopTool>
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

const TopTool = styled('div', {
  base: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    mx: 'auto',
    p: 2,
    opacity: 0.6,
    borderBottomRadius: 'md',
    transition: 'opacity 0.2s',
    backgroundColor: 'bg.default',
    boxShadow: 'md',
    display: 'flex',
    gap: 2,
    _hover: {
      opacity: 1,
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

const CompareSeparator = styled('div', {
  base: {
    borderRadius: 'md',
    boxShadow: 'md',
    p: 4,
    mx: 2,
    backgroundColor: 'bg.default',
    color: 'fg.default',
  },
});
