import { Index, onCleanup, onMount, createSignal } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { Application } from 'pixi.js';

import { VStack } from 'styled-system/jsx/vstack';
import { Grid } from 'styled-system/jsx/grid';
import { ActionTabTitle } from './ActionTabTitle';
import { ActionCharacter, type ActionCharacterRef } from './ActionCharacter';
import { ActionCard } from './ActionCard';

import { CharacterAction } from '@/const/actions';

const actions: CharacterAction[] = Object.values(CharacterAction);
const COLUMN_COUNT = 4;

export const ActionTab = () => {
  const [itemGap, setItemGap] = createSignal({ x: 150, y: 300 });
  const canvasResizeObserver = new ResizeObserver(handleCanvasResize);
  let appContainer!: HTMLDivElement;
  const characterRefs: ActionCharacterRef[] = [];
  const app = new Application();

  function handleRef(i: number) {
    return (element: ActionCharacterRef) => {
      characterRefs[i] = element;
    };
  }

  function handleCanvasResize() {
    const width = appContainer.clientWidth;
    const height = appContainer.clientHeight;
    setItemGap({
      x: width / COLUMN_COUNT,
      y: height / Math.ceil(actions.length / COLUMN_COUNT),
    });
  }

  onMount(async () => {
    await app.init({
      resizeTo: appContainer,
      backgroundAlpha: 0,
    });
    appContainer.appendChild(app.canvas);
    canvasResizeObserver.observe(appContainer);
  });

  onCleanup(() => {
    app.destroy();
  });

  return (
    <VStack>
      <ActionTabTitle characterRefs={characterRefs} />
      <ActionTableContainer>
        <Grid columns={4}>
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
              x: (i % 4) * itemGap().x + Math.floor(itemGap().x / 2),
              y:
                Math.floor(i / 4) * itemGap().y +
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
