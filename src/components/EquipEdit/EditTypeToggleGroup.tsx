import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $equpimentDrawerEditType } from '@/store/trigger';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

export const EditTypeToggleGroup = () => {
  const t = useTranslate();
  const editType = useStore($equpimentDrawerEditType);

  function handleChange(details: ValueChangeDetails) {
    const editType = details.value as 'mixDye' | 'hsvAdjust';
    if (editType) {
      $equpimentDrawerEditType.set(editType);
    }
  }

  const options = [
    {
      label: t('dye.mixDye'),
      value: 'mixDye',
    },
    {
      label: t('dye.prism'),
      value: 'hsvAdjust',
    },
  ];

  return (
    <SimpleToggleGroup
      size="xs"
      options={options}
      value={editType()}
      onValueChange={handleChange}
    />
  );
};
