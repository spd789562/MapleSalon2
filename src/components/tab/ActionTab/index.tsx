import { Index, onCleanup, onMount, createSignal } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import {
  $preferRenderer,
  $actionRenderer,
  $isActionRendererInitialized,
} from '@/store/renderer';

import { VStack } from 'styled-system/jsx/vstack';
import { Grid } from 'styled-system/jsx/grid';
import { ActionTabTitle } from './ActionTabTitle';
import { ActionCharacter, type ActionCharacterRef } from './ActionCharacter';
import { ActionCard } from './ActionCard';

import { CharacterAction } from '@/const/actions';

const actions: CharacterAction[] = Object.values(CharacterAction);
const COLUMN_COUNT = 3;

export const ActionTab = () => {
  const [itemGap, setItemGap] = createSignal({ x: 150, y: 300 });
  const canvasResizeObserver = new ResizeObserver(handleCanvasResize);
  let appContainer!: HTMLDivElement;
  const characterRefs: ActionCharacterRef[] = [];
  const app = $actionRenderer.get();

  function handleRef(i: number) {
    return (element: ActionCharacterRef) => {
      characterRefs[i] = element;
    };
  }

  function handleCanvasResize() {
    const width = appContainer.clientWidth;
    const height = appContainer.clientHeight;
    setItemGap({
      x: Math.floor(width / COLUMN_COUNT),
      y: Math.floor(height / Math.ceil(actions.length / COLUMN_COUNT)),
    });
  }

  onMount(async () => {
    const isInitialized = $isActionRendererInitialized.get();
    if (!isInitialized) {
      await app.init({
        resizeTo: appContainer,
        backgroundAlpha: 0,
        preference: $preferRenderer.get(),
      });
      $isActionRendererInitialized.set(true);
    }
    appContainer.appendChild(app.canvas);
    app.resizeTo = appContainer;
    canvasResizeObserver.observe(appContainer);
  });

  onCleanup(() => {
    canvasResizeObserver.disconnect();
  });

  return (
    <VStack>
      <ActionTabTitle characterRefs={characterRefs} />
      <ActionTableContainer>
        <Grid columns={COLUMN_COUNT} position="relative" zIndex="1">
          <Index each={actions}>
            {(action, i) => (
              <ActionCard ref={() => characterRefs[i]} action={action()} />
            )}
          </Index>
        </Grid>
        {/* use single app here, separate app will cause serious performance issue */}
        <ActionTableCanvas ref={appContainer} />
      </ActionTableContainer>
      <Index each={actions}>
        {(action, i) => (
          <ActionCharacter
            ref={handleRef(i)}
            action={action()}
            mainApp={app}
            position={{
              x: (i % COLUMN_COUNT) * itemGap().x + Math.floor(itemGap().x / 2),
              y:
                Math.floor(i / COLUMN_COUNT) * itemGap().y +
                Math.floor(itemGap().y / 2) +
                100,
            }}
          />
        )}
      </Index>
    </VStack>
  );
};

const ActionTableContainer = styled('div', {
  base: {
    position: 'relative',
    width: '100%',
  },
});

const ActionTableCanvas = styled('div', {
  base: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '100%',
  },
});
