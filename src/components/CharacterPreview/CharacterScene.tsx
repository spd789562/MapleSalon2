import { Show, createSignal } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { $currentScene } from '@/store/character/store';
import {
  $currentCharacter,
  $previewCharacter,
} from '@/store/character/selector';
import { $showPreviousCharacter } from '@/store/trigger';

import LoaderCircle from 'lucide-solid/icons/loader-circle';
import ChevronRightIcon from 'lucide-solid/icons/chevron-right';
import { CharacterView } from './Character';
import { CharacterSceneSelection } from './CharacterSceneSelection';
import { ShowPreviousSwitch } from './ShowPreviousSwitch';

import { PreviewSceneBackground } from '@/const/scene';

export const CharacterScene = () => {
  const [isLoading, setIsLoading] = createSignal(false);
  const scene = useStore($currentScene);
  const isShowComparison = useStore($showPreviousCharacter);

  function handleLoad() {
    setIsLoading(true);
  }
  function handleLoaded() {
    setIsLoading(false);
  }

  return (
    <CharacterSceneContainer bgType={scene()}>
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
      <CharacterView
        onLoad={handleLoad}
        onLoaded={handleLoaded}
        store={$previewCharacter}
        target="preview"
      />
      <TopTool>
        <ShowPreviousSwitch />
      </TopTool>
      <CharacterSceneSelection />
      <Show when={isLoading()}>
        <LoadingBackdrop>
          <Loading>
            <LoaderCircle size={48} />
          </Loading>
        </LoadingBackdrop>
      </Show>
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
    alignItems: 'center',
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

const LoadingBackdrop = styled('div', {
  base: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'bg.muted',
    opacity: 0.75,
  },
});

const Loading = styled('div', {
  base: {
    animation: 'rotate infinite 1s linear',
    color: 'fg.muted',
  },
});
