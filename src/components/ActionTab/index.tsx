import { VStack } from 'styled-system/jsx/vstack';
import { Grid } from 'styled-system/jsx/grid';
import { ActionTabTitle } from './ActionTabTitle';
import { ActionCharacter, type ActionCharacterRef } from './ActionCharacter';
import { CharacterAction } from '@/const/actions';

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
      <Grid>
        <ActionCharacter ref={handleRef(0)} action={CharacterAction.Stand1} />
      </Grid>
    </VStack>
  );
};
