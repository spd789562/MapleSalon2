import { useStore } from '@nanostores/solid';

import { $currentCharacterInfo } from '@/store/character/store';
import { $currentHandType } from '@/store/character/selector';

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
    firstItem &&
      $currentCharacterInfo.setKey('handType', firstItem as CharacterHandType);
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
