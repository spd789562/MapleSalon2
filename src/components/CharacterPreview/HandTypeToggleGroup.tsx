import { useStore } from '@nanostores/solid';

import { $currentHandType } from '@/store/character/selector';
import { setCharacterHandType } from '@/store/character/action';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import { CharacterHandType } from '@/const/hand';

const options = [
  {
    label: '單手',
    value: CharacterHandType.SingleHand,
  },
  {
    label: '雙手',
    value: CharacterHandType.DoubleHand,
  },
];

export const HandTypeToggleGroup = () => {
  const earType = useStore($currentHandType);
  function handleHandTypeChange(details: ValueChangeDetails) {
    const firstItem = details.value?.[0];
    firstItem && setCharacterHandType(firstItem as CharacterHandType);
  }

  return (
    <SimpleToggleGroup
      size="sm"
      options={options}
      value={[earType()]}
      onValueChange={handleHandTypeChange}
    />
  );
};
