import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $preferScaleMode, setPreferScaleMode } from '@/store/settingDialog';
import { openDialog, DialogType } from '@/store/confirmDialog';
import { refreshPage } from '@/store/action';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

export const PreferScaleModeToggleGroup = () => {
  const t = useTranslate();
  const renderer = useStore($preferScaleMode);

  function handleChange(details: ValueChangeDetails) {
    const changedScaleMode = details.value as 'linear' | 'nearest';
    if (changedScaleMode) {
      setPreferScaleMode(changedScaleMode);

      openDialog({
        type: DialogType.Confirm,
        title: t('setting.scaleModeConfirm'),
        closable: true,
        description: t('setting.scaleModeConfirmDesc'),
        confirmButton: {
          isAsyncClick: true,
          text: t('setting.refreshNow'),
          onClick: () => refreshPage(),
        },
        cancelButton: {
          text: t('setting.refreshLater'),
        },
      });
    }
  }

  const options = useLocalizedOptions([
    {
      label: 'setting.scaleModeLinear',
      value: 'linear',
    },
    {
      label: 'setting.scaleModeNearest',
      value: 'nearest',
    },
  ]);

  return (
    <SimpleToggleGroup
      size="sm"
      options={options()}
      value={renderer()}
      onValueChange={handleChange}
    />
  );
};
