import { useStore } from '@nanostores/solid';

import { $dyeAction, setDyeAction } from '@/store/toolTab';

import { ActionSelect as BaseActionSelect } from '@/components/elements/ActionSelect';

import type { CharacterAction } from '@/const/actions';

export const ResultActionSelect = () => {
  const action = useStore($dyeAction);
  function handleActionChange(action: CharacterAction | undefined) {
    action && setDyeAction(action);
  }

  return (
    <BaseActionSelect value={action()} onValueChange={handleActionChange} />
  );
};
