import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $windowScale, setWindowScale } from '@/store/settingDialog';
import { openDialog, DialogType } from '@/store/confirmDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';

import { WindowScales, setWindowZoom } from '@/const/setting/scale';

export const WindowScaleSelect = () => {
  const t = useTranslate();
  const scale = useStore($windowScale);

  async function handleChange(details: ValueChangeDetails) {
    const value = Number(details.value[0]);
    if (value && !Number.isNaN(value)) {
      if (value > 1.5) {
        openDialog({
          type: DialogType.Confirm,
          title: t('setting.scaleConfirm'),
          description: t('setting.scaleConfirmDesc', {
            resolution: `${value * 100}%`,
          }),
          confirmButton: {
            onClick: () => {
              setWindowScale(value);
              setWindowZoom(value);
            },
          },
        });
      } else {
        setWindowScale(value);
        setWindowZoom(value);
      }
    }
  }

  return (
    <HStack>
      <Text as="label" for="scale-select" textWrap="nowrap">
        {t('setting.scale')}
      </Text>
      <SimpleSelect
        id="scale-select"
        value={[scale().toString()]}
        items={WindowScales.map((scale) => ({
          value: scale.toString(),
          label: `${scale * 100}%`,
        }))}
        onValueChange={handleChange}
        positioning={{ sameWidth: true }}
      />
    </HStack>
  );
};
