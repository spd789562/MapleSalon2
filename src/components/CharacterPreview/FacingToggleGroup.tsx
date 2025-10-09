import { useStore } from '@nanostores/solid';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

import { $characterFlip } from '@/store/character/store';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

export const FacingToggleGroup = () => {
  const characterFlip = useStore($characterFlip);
  function handleHandTypeChange(details: ValueChangeDetails) {
    $characterFlip.set(details.value === 'true');
  }

  const options = useLocalizedOptions([
    {
      label: 'character.facingLeft',
      value: 'false',
    },
    {
      label: 'character.facingRight',
      value: 'true',
    },
  ]);

  return (
    <SimpleToggleGroup
      size="sm"
      options={options()}
      value={characterFlip().toString()}
      onValueChange={handleHandTypeChange}
    />
  );
};
