import { Show, createSignal, onCleanup, onMount } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { $currentScene } from '@/store/character/store';
import {
  $currentCharacter,
  $previewCharacter,
  $sceneCustomColorStyle,
} from '@/store/character/selector';
import { $showPreviousCharacter } from '@/store/trigger';

import LoaderCircle from 'lucide-solid/icons/loader-circle';
import ChevronRightIcon from 'lucide-solid/icons/chevron-right';
import { CharacterView } from './Character';
import { CharacterSceneSelection } from './CharacterSceneSelection';
import { ShowPreviousSwitch } from './ShowPreviousSwitch';
import { ZoomControl } from './ZoomControl';

import { PreviewSceneBackground } from '@/const/scene';

export const CharacterScene = () => {
  let containerRef!: HTMLDivElement;
  const [isLoading, setIsLoading] = createSignal(false);
  const [isLockInteraction, setIsLockInteraction] = createSignal(true);
  const scene = useStore($currentScene);
  const customColorStyle = useStore($sceneCustomColorStyle);
  const isShowComparison = useStore($showPreviousCharacter);

  function handleLoad() {
    setIsLoading(true);
  }
  function handleLoaded() {
    setIsLoading(false);
  }
  function handleFocusContainer() {
    setIsLockInteraction(false);
  }
  function handleBlurContainer() {
    setIsLockInteraction(true);
  }

  onMount(() => {
    function preventScrollWhenNotLock(e: Event) {
      if (!isLockInteraction()) {
        e.preventDefault();
      }
    }
    containerRef.addEventListener('wheel', preventScrollWhenNotLock, {
      passive: false,
    });
    onCleanup(() => {
      containerRef.removeEventListener('wheel', preventScrollWhenNotLock);
    });
  });

  return (
    <CharacterSceneContainer
      ref={containerRef}
      bgType={scene()}
      style={customColorStyle()}
      role="button"
      tabIndex="0"
      onFocus={handleFocusContainer}
      onBlur={handleBlurContainer}
    >
      <Show when={isShowComparison()}>
        <CharacterView
          onLoad={handleLoad}
          onLoaded={handleLoaded}
          store={$currentCharacter}
          target="original"
          isLockInteraction={isLockInteraction()}
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
        isLockInteraction={isLockInteraction()}
      />
      <TopTool>
        <ShowPreviousSwitch />
      </TopTool>
      <BottomLeftTool>
        <ZoomControl />
      </BottomLeftTool>
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
    // py: 10,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 'lg',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    _focus: {
      outline: '2px solid',
      outlineColor: 'accent.a6',
      boxShadow: '0 0 5px 2px {colors.accent.a6}',
    },
  },
  variants: {
    bgType: {
      alpha: {
        ...PreviewSceneBackground.alpha,
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
