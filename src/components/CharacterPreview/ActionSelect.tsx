import { useStore } from '@nanostores/solid';

import { $currentAction } from '@/store/character/selector';
import { setCharacterAction } from '@/store/character/action';

import { ActionSelect as BaseActionSelect } from '@/components/elements/ActionSelect';

import type { CharacterAction } from '@/const/actions';

export const ActionSelect = () => {
  const action = useStore($currentAction);
  function handleActionChange(action: CharacterAction | undefined) {
    action && setCharacterAction(action);
  }

  return (
    <BaseActionSelect value={action()} onValueChange={handleActionChange} />
  );
};
