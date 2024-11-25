import { Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { useMountTab } from './MountTabContext';

import { LoadingWithBackdrop } from '@/components/elements/LoadingWithBackdrop';
import { CharacterPreviewView } from './CharacterPreview';
import { CharacterSceneSelection } from '@/components/CharacterPreview/CharacterSceneSelection';
import { CharacterSceneContainer } from '@/components/CharacterPreview/CharacterSceneContainer';
import { ZoomControl } from '@/components/tab/ChairTab/ZoomControl';

export const CharacterScene = () => {
  const [state, actions] = useMountTab();

  function handleLoad() {
    actions.setIsLoading(true);
  }
  function handleLoaded() {
    actions.setIsLoading(false);
  }

  return (
    <CharacterSceneContainer>
      <CharacterPreviewView
        onLoad={handleLoad}
        onLoaded={handleLoaded}
        target="preview"
        ref={actions.setMountRef}
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
