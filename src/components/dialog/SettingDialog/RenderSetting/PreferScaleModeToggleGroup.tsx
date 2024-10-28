import { useStore } from '@nanostores/solid';

import { $preferScaleMode, setPreferScaleMode } from '@/store/settingDialog';
import { openDialog, DialogType } from '@/store/confirmDialog';
import { refreshPage } from '@/store/action';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

const options = [
  {
    label: '平滑',
    value: 'linear',
  },
  {
    label: '點陣',
    value: 'nearest',
  },
];

export const PreferScaleModeToggleGroup = () => {
  const renderer = useStore($preferScaleMode);

  function handleChange(details: ValueChangeDetails) {
    const changedScaleMode = details.value as 'linear' | 'nearest';
    if (changedScaleMode) {
      setPreferScaleMode(changedScaleMode);

      openDialog({
        type: DialogType.Confirm,
        title: '變更縮放模式',
        closable: true,
        description:
          '頁面需要重新載入以套用新的縮放設定，請問是否立即重整頁面？',
        confirmButton: {
          isAsyncClick: true,
          text: '立即重整',
          onClick: () => refreshPage(),
        },
        cancelButton: {
          text: '稍後重整',
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
