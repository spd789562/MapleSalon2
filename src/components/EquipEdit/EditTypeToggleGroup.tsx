import { createMemo } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate, useLocale } from '@/context/i18n';

import { $equpimentDrawerEditType } from '@/store/trigger';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

export const EditTypeToggleGroup = () => {
  const t = useTranslate();
  const locale = useLocale();
  const editType = useStore($equpimentDrawerEditType);

  function handleChange(details: ValueChangeDetails) {
    const editType = details.value as 'mixDye' | 'hsvAdjust';
    if (editType) {
      $equpimentDrawerEditType.set(editType);
    }
  }

  const options = createMemo(() => {
    const _ = locale();
    return [
      {
        label: t('dye.mixDye'),
        value: 'mixDye',
      },
      {
        label: t('dye.prism'),
        value: 'hsvAdjust',
      },
    ];
  });

  return (
    <SimpleToggleGroup
      size="xs"
      options={options()}
      value={editType()}
      onValueChange={handleChange}
    />
  );
};
