import { For } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';
import { css } from 'styled-system/css';

import { Flex } from 'styled-system/jsx';
import { DyeType } from '@/const/toolTab';

const GradientMap = {
  [DyeType.Hue]: 'hueConic',
  [DyeType.Saturation]: 'saturation',
  [DyeType.Birghtness]: 'brightness',
};

export interface DyeInfoProps {
  dyeData: Partial<Record<DyeType, number>>;
}
export const DyeInfo = (props: DyeInfoProps) => {
  return (
    <DyeInfoPanel gap="1" data-part="info">
      <For each={Object.entries(props.dyeData)}>
        {([key, value]) => (
          <>
            <ColorBlock
              class={css({
                backgroundGradient: GradientMap[key as DyeType],
              })}
            />
            <span>+{value}</span>
          </>
        )}
      </For>
    </DyeInfoPanel>
  );
};

const DyeInfoPanel = styled(Flex, {
  base: {
    py: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'bg.default',
    borderTopRadius: 'md',
    boxShadow: 'md',
    opacity: 0,
    transition: 'opacity 0.2s',
    fontSize: 'xs',
  },
});
const ColorBlock = styled('div', {
  base: {
    borderRadius: 'sm',
    w: 3,
    h: 3,
    display: 'inline-block',
  },
});
