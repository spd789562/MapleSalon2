import { styled } from 'styled-system/jsx/factory';
import { useStore } from '@nanostores/solid';

import { $dyeTypeEnabled, toggleDyeConfigEnabled } from '@/store/toolTab';

import * as RadioGroup from '@/components/ui/radioGroup';

import { DyeType } from '@/const/toolTab';

export const DyeTypeRadioGroup = () => {
  const dyeTypeEnabled = useStore($dyeTypeEnabled);

  const handleValueChange = (value: RadioGroup.ValueChangeDetails) => {
    toggleDyeConfigEnabled(value.value as DyeType, true);
  };

  return (
    <RadioGroup.Root
      width="full"
      orientation="horizontal"
      value={dyeTypeEnabled()}
      onValueChange={handleValueChange}
    >
      <RadioGroup.Item value={DyeType.Hue}>
        <RadioGroup.ItemControl />
        <RadioGroup.ItemText>
          色相
          <ColorBlock backgroundGradient="hueConic" />
        </RadioGroup.ItemText>
        <RadioGroup.ItemHiddenInput />
      </RadioGroup.Item>
      <RadioGroup.Item value={DyeType.Saturation}>
        <RadioGroup.ItemControl />
        <RadioGroup.ItemText>
          飽和度
          <ColorBlock backgroundGradient="saturation" />
        </RadioGroup.ItemText>
        <RadioGroup.ItemHiddenInput />
      </RadioGroup.Item>
      <RadioGroup.Item value={DyeType.Birghtness}>
        <RadioGroup.ItemControl />
        <RadioGroup.ItemText>
          亮度
          <ColorBlock backgroundGradient="brightness" />
        </RadioGroup.ItemText>
        <RadioGroup.ItemHiddenInput />
      </RadioGroup.Item>
    </RadioGroup.Root>
  );
};

const ColorBlock = styled('div', {
  base: {
    display: 'inline-block',
    w: 3,
    h: 3,
    ml: 2,
    borderRadius: 'sm',
    boxShadow: 'sm',
  },
});
