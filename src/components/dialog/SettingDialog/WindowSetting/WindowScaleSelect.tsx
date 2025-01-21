import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $windowScale, setWindowScale } from '@/store/settingDialog';

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
      setWindowScale(value);
      await setWindowZoom(value);
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
