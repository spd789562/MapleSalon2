import { useStore } from '@nanostores/solid';

import { $currentCharacterInfo } from '@/store/character/store';
import { $currentAction } from '@/store/character/selector';

import { ActionSelect as BaseActionSelect } from '@/components/elements/ActionSelect';

import type { CharacterAction } from '@/const/actions';

export const ActionSelect = () => {
  const action = useStore($currentAction);
  function handleActionChange(action: CharacterAction | undefined) {
    action && $currentCharacterInfo.setKey('action', action);
  }

  return (
    <BaseActionSelect value={action()} onValueChange={handleActionChange} />
  );
};
