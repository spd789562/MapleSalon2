import { useStore } from '@nanostores/solid';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

import { $equpimentDrawerEditType } from '@/store/trigger';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

export const EditTypeToggleGroup = () => {
  const editType = useStore($equpimentDrawerEditType);

  function handleChange(details: ValueChangeDetails) {
    const editType = details.value as 'mixDye' | 'hsvAdjust';
    if (editType) {
      $equpimentDrawerEditType.set(editType);
    }
  }

  const options = useLocalizedOptions([
    {
      label: 'dye.mixDye',
      value: 'mixDye',
    },
    {
      label: 'dye.prism',
      value: 'hsvAdjust',
    },
  ]);

  return (
    <SimpleToggleGroup
      size="xs"
      options={options()}
      value={editType()}
      onValueChange={handleChange}
    />
  );
};
