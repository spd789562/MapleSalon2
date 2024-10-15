import { useStore } from '@nanostores/solid';

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
  const renderer = useStore($preferRenderer);

  function handleChange(details: ValueChangeDetails) {
    const changedColorMode = details.value as 'webgl' | 'webgpu';
    if (changedColorMode) {
      setPreferRenderer(changedColorMode);

      openDialog({
        type: DialogType.Confirm,
        title: '變更渲染器',
        closable: true,
        description:
          '頁面需要重新載入以套用新的渲染器設定，請問是否立即重整頁面？',
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
