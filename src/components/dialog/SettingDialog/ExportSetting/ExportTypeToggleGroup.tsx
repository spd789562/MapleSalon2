import { useStore } from '@nanostores/solid';

import { $exportType, setExportType } from '@/store/settingDialog';

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
  const exportType = useStore($exportType);

  function handleExportTypeChange(details: ValueChangeDetails) {
    const firstItem = details.value;
    firstItem && setExportType(firstItem as ActionExportType);
  }

  return (
    <SimpleToggleGroup
      size="sm"
      options={options}
      value={exportType()}
      onValueChange={handleExportTypeChange}
    />
  );
};
