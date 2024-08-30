import { styled } from 'styled-system/jsx/factory';

import { Flex } from 'styled-system/jsx';

export interface DyeInfoProps {
  originHex: string;
  dyeHex: string;
  dyeAlpha: number;
}
export const DyeInfo = (props: DyeInfoProps) => {
  return (
    <DyeInfoPanel gap="1" data-part="info">
      <ColorBlock style={{ 'background-color': props.originHex }} />
      <span>+{props.dyeAlpha}</span>
      <ColorBlock style={{ 'background-color': props.dyeHex }} />
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
