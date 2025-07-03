import { useStore } from '@nanostores/solid';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

import { $currentEarType } from '@/store/character/selector';
import { setCharacterEarType } from '@/store/character/action';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import { CharacterEarType } from '@/const/ears';

export const EarTypeToggleGroup = () => {
  const earType = useStore($currentEarType);
  function handleEarTypeChange(details: ValueChangeDetails) {
    const firstItem = details.value;
    firstItem && setCharacterEarType(firstItem as CharacterEarType);
  }

  const options = useLocalizedOptions([
    {
      label: 'character.earTypeHuman',
      value: CharacterEarType.HumanEar,
    },
    {
      label: 'character.earTypeElf',
      value: CharacterEarType.Ear,
    },
    {
      label: 'character.earTypeLef',
      value: CharacterEarType.LefEar,
    },
    {
      label: 'character.earTypeHighLef',
      value: CharacterEarType.HighLefEar,
    },
  ]);

  return (
    <SimpleToggleGroup
      size="sm"
      options={options()}
      value={earType()}
      onValueChange={handleEarTypeChange}
    />
  );
};
