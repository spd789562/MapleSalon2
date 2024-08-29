import { styled } from 'styled-system/jsx/factory';
import { useStore } from '@nanostores/solid';

import { $dyeTypeEnabled, toggleDyeConfigEnabled } from '@/store/toolTab';

import { HStack } from 'styled-system/jsx/hstack';
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
      {/* <HStack width="full" gap="3"> */}
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
      <RadioGroup.Item value={DyeType.Lightness}>
        <RadioGroup.ItemControl />
        <RadioGroup.ItemText>
          亮度
          <ColorBlock backgroundGradient="brightness" />
        </RadioGroup.ItemText>
        <RadioGroup.ItemHiddenInput />
      </RadioGroup.Item>
      {/* </HStack> */}
    </RadioGroup.Root>
  );
};

const ColorBlock = styled('div', {
  base: {
    borderRadius: 'sm',
    w: 3,
    h: 3,
    display: 'inline-block',
    ml: 2,
  },
});
