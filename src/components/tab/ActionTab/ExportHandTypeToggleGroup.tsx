import { useStore } from '@nanostores/solid';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

import { $actionExportHandType } from '@/store/toolTab';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import { CharacterHandType } from '@/const/hand';

export const ExportHandTypeToggleGroup = () => {
  const handType = useStore($actionExportHandType);

  function handleExportTypeChange(details: ValueChangeDetails) {
    const firstItem = details.value;
    firstItem && $actionExportHandType.set(firstItem as CharacterHandType);
  }
  const options = useLocalizedOptions([
    {
      label: 'character.handTypeNormal',
      value: CharacterHandType.SingleHand,
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
      value={handType()}
      onValueChange={handleExportTypeChange}
    />
  );
};
