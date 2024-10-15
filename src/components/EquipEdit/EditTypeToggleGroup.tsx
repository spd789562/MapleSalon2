import { useStore } from '@nanostores/solid';

import { $equpimentDrawerEditType } from '@/store/trigger';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

const options = [
  {
    label: '混染',
    value: 'mixDye',
  },
  {
    label: '稜鏡',
    value: 'hsvAdjust',
  },
];

export const EditTypeToggleGroup = () => {
  const editType = useStore($equpimentDrawerEditType);

  function handleChange(details: ValueChangeDetails) {
    const editType = details.value as 'mixDye' | 'hsvAdjust';
    if (editType) {
      $equpimentDrawerEditType.set(editType);
    }
  }

  return (
    <SimpleToggleGroup
      size="xs"
      options={options}
      value={editType()}
      onValueChange={handleChange}
    />
  );
};
