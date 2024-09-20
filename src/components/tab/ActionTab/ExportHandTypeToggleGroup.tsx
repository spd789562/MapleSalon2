import { useStore } from '@nanostores/solid';

import { $actionExportHandType } from '@/store/toolTab';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import { CharacterHandType } from '@/const/hand';

const options = [
  {
    label: '一般',
    value: CharacterHandType.SingleHand,
  },
  {
    label: '火槍',
    value: CharacterHandType.Gun,
  },
];

export const ExportHandTypeToggleGroup = () => {
  const handType = useStore($actionExportHandType);

  function handleExportTypeChange(details: ValueChangeDetails) {
    const firstItem = details.value?.[0];
    firstItem && $actionExportHandType.set(firstItem as CharacterHandType);
  }

  return (
    <SimpleToggleGroup
      size="sm"
      options={options}
      value={[handType()]}
      onValueChange={handleExportTypeChange}
    />
  );
};
