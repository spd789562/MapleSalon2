import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $preferRenderer, setPreferRenderer } from '@/store/settingDialog';
import { openDialog, DialogType } from '@/store/confirmDialog';
import { refreshPage } from '@/store/action';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

const options = [
  {
    label: 'WebGPU',
    value: 'webgpu',
  },
  {
    label: 'WebGL',
    value: 'webgl',
  },
];

export const PreferRendererToggleGroup = () => {
  const t = useTranslate();
  const renderer = useStore($preferRenderer);

  function handleChange(details: ValueChangeDetails) {
    const changedColorMode = details.value as 'webgl' | 'webgpu';
    if (changedColorMode) {
      setPreferRenderer(changedColorMode);

      openDialog({
        type: DialogType.Confirm,
        title: t('setting.changeRendererConfirm'),
        closable: true,
        description: t('setting.changeRendererConfirmDesc'),
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

  return (
    <SimpleToggleGroup
      size="sm"
      options={options}
      value={renderer()}
      onValueChange={handleChange}
    />
  );
};
