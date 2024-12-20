import { Index, onCleanup, onMount, createSignal, createMemo } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';
import { useStore } from '@nanostores/solid';

import { $globalRenderer } from '@/store/renderer';
import { $actionExportHandType } from '@/store/toolTab';

import { VStack } from 'styled-system/jsx/vstack';
import { Grid } from 'styled-system/jsx/grid';
import { ActionTabProvider } from './ActionTabContext';
import { ActionTabTitle } from './ActionTabTitle';
import { ActionCharacter, type ActionCharacterRef } from './ActionCharacter';
import { ActionCard } from './ActionCard';

import { CharacterAction, GunActions as BaseGunActions } from '@/const/actions';
import { CharacterHandType } from '@/const/hand';

const SpeicalActions = ['stand1_floating', 'stand2_floating'];
const Actions: CharacterAction[] = Object.values(CharacterAction);
const NormalActions = [
  ...Actions.slice(0, 2),
  ...SpeicalActions,
  ...Actions.slice(2),
];
// gun only have single hand actions
const GunActions = [
  ...BaseGunActions.slice(0, 1),
  'stand1_floating',
  ...BaseGunActions.slice(1),
];
const COLUMN_COUNT = 3;

export const ActionTab = () => {
  const handType = useStore($actionExportHandType);
  const [itemGap, setItemGap] = createSignal({ x: 150, y: 300 });
  const canvasResizeObserver = new ResizeObserver(handleCanvasResize);
  let appContainer!: HTMLDivElement;
  const characterRefs: ActionCharacterRef[] = [];
  const app = $globalRenderer.get();

  const actions = createMemo(() => {
    if (handType() === CharacterHandType.Gun) {
      return GunActions;
    }
    return NormalActions;
  });

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
      y: Math.floor(height / Math.ceil(actions().length / COLUMN_COUNT)),
    });
  }

  onMount(() => {
    appContainer.appendChild(app.canvas);
    app.resizeTo = appContainer;
    canvasResizeObserver.observe(appContainer);
  });

  onCleanup(() => {
    canvasResizeObserver.disconnect();
  });

  return (
    <ActionTabProvider>
      <VStack>
        <ActionTabTitle characterRefs={characterRefs} />
        <ActionTableContainer>
          <Grid columns={COLUMN_COUNT} position="relative" zIndex="1">
            <Index each={actions()}>
              {(action, i) => (
                <ActionCard ref={() => characterRefs[i]} action={action()} />
              )}
            </Index>
          </Grid>
          {/* use single app here, separate app will cause serious performance issue */}
          <ActionTableCanvas ref={appContainer} />
        </ActionTableContainer>
        <Index each={actions()}>
          {(action, i) => (
            <ActionCharacter
              ref={handleRef(i)}
              action={action()}
              mainApp={app}
              position={{
                x:
                  (i % COLUMN_COUNT) * itemGap().x +
                  Math.floor(itemGap().x / 2),
                y:
                  Math.floor(i / COLUMN_COUNT) * itemGap().y +
                  Math.floor(itemGap().y / 2) +
                  100,
              }}
            />
          )}
        </Index>
      </VStack>
    </ActionTabProvider>
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
    overflow: 'hidden',
  },
});
