import { useStore } from '@nanostores/solid';

import { $currentEarType } from '@/store/character/selector';
import { setCharacterEarType } from '@/store/character/action';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import { CharacterEarType } from '@/const/ears';

const options = [
  {
    label: '人類耳',
    value: CharacterEarType.HumanEar,
  },
  {
    label: '精靈耳',
    value: CharacterEarType.Ear,
  },
  {
    label: '木雷普',
    value: CharacterEarType.LefEar,
  },
  {
    label: '亥雷普',
    value: CharacterEarType.HighLefEar,
  },
];

export const EarTypeToggleGroup = () => {
  const earType = useStore($currentEarType);
  function handleEarTypeChange(details: ValueChangeDetails) {
    const firstItem = details.value;
    firstItem && setCharacterEarType(firstItem as CharacterEarType);
  }

  return (
    <SimpleToggleGroup
      size="sm"
      options={options}
      value={earType()}
      onValueChange={handleEarTypeChange}
    />
  );
};
