import { createSignal, Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { $previewCharacter } from '@/store/character/selector';

import { LoadingWithBackdrop } from '@/components/elements/LoadingWithBackdrop';
import {
  MiniCharacterPreview,
  type MiniCharacterForwardProps,
} from './MiniCharacterPreview';
import { MiniCharacterZoomControl } from './MiniCharacterZoomControl';

export const MiniCharacterWindow = () => {
  let characterRef!: MiniCharacterForwardProps;
  const [isLoading, setIsLoading] = createSignal(false);

  function handleLoad() {
    setIsLoading(true);
  }
  function handleLoaded() {
    setIsLoading(false);
  }
  function handleResetZoom() {
    characterRef?.resetZoom();
  }
  function handleResetPosition() {
    characterRef?.resetPosition();
  }

  return (
    <Container>
      <CharacterPositioner>
        <MiniCharacterPreview
          forwardRef={(ref) => {
            characterRef = ref;
          }}
          onLoad={handleLoad}
          onLoaded={handleLoaded}
          store={$previewCharacter}
        />
      </CharacterPositioner>
      <BottomLeftTool>
        <MiniCharacterZoomControl
          resetCenter={handleResetPosition}
          resetZoom={handleResetZoom}
        />
      </BottomLeftTool>
      <Show when={isLoading()}>
        <LoadingWithBackdrop />
      </Show>
    </Container>
  );
};

const Container = styled('div', {
  base: {
    position: 'relative',
    height: '52',
    maxHeight: '52',
  },
});

const CharacterPositioner = styled('div', {
  base: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const BottomLeftTool = styled('div', {
  base: {
    position: 'absolute',
    bottom: 0.5,
    left: 0.5,
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
