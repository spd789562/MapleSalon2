import { useStore } from '@nanostores/solid';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

import { $currentHandType } from '@/store/character/selector';
import { setCharacterHandType } from '@/store/character/action';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import { CharacterHandType } from '@/const/hand';

export const HandTypeToggleGroup = () => {
  const earType = useStore($currentHandType);
  function handleHandTypeChange(details: ValueChangeDetails) {
    setCharacterHandType(details.value as CharacterHandType);
  }

  const options = useLocalizedOptions([
    {
      label: 'character.handTypeSingle',
      value: CharacterHandType.SingleHand,
    },
    {
      label: 'character.handTypeDouble',
      value: CharacterHandType.DoubleHand,
    },
    {
      label: 'character.handTypeGun',
      value: CharacterHandType.Gun,
    },
  ]);

  return (
    <SimpleToggleGroup
      size="sm"
      options={options()}
      value={earType()}
      onValueChange={handleHandTypeChange}
    />
  );
};
