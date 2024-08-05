import { useStore } from '@nanostores/solid';

import { $actionExportType } from '@/store/toolTab';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import { ActionExportType, ActionExportTypeExtensions } from '@/const/toolTab';

const options = [
  {
    label: ActionExportTypeExtensions[ActionExportType.Gif],
    value: ActionExportType.Gif,
  },
  {
    label: ActionExportTypeExtensions[ActionExportType.Apng],
    value: ActionExportType.Apng,
  },
  {
    label: ActionExportTypeExtensions[ActionExportType.Webp],
    value: ActionExportType.Webp,
  },
];

export const ExportTypeToggleGroup = () => {
  const exportType = useStore($actionExportType);

  function handleExportTypeChange(details: ValueChangeDetails) {
    const firstItem = details.value?.[0];
    firstItem && $actionExportType.set(firstItem as ActionExportType);
  }

  return (
    <SimpleToggleGroup
      size="sm"
      options={options}
      value={[exportType()]}
      onValueChange={handleExportTypeChange}
    />
  );
};
