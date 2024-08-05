import { Index } from 'solid-js';

import { VStack } from 'styled-system/jsx/vstack';
import { Grid } from 'styled-system/jsx/grid';
import { ActionTabTitle } from './ActionTabTitle';
import type { ActionCharacterRef } from './ActionCharacter';
import { ActionCard } from './ActionCard';

import { CharacterAction } from '@/const/actions';

const actions: CharacterAction[] = Object.values(CharacterAction);

export const ActionTab = () => {
  const characterRefs: ActionCharacterRef[] = [];

  function handleRef(i: number) {
    return (element: ActionCharacterRef) => {
      characterRefs[i] = element;
    };
  }

  return (
    <VStack>
      <ActionTabTitle characterRefs={characterRefs} />
      <Grid columns={4}>
        <Index each={actions}>
          {(action, i) => <ActionCard ref={handleRef(i)} action={action()} />}
        </Index>
      </Grid>
    </VStack>
  );
};
