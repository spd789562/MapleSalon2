import { Show, createMemo } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { Text } from '@/components/ui/text';

import { CharacterLoader } from '@/renderer/character/loader';

export interface ItemNotExistMaskProps {
  id: number;
}
export const ItemNotExistMask = (props: ItemNotExistMaskProps) => {
  const isExistInCurrentVersion = createMemo(() => {
    return !!CharacterLoader.getPiecePathIfExist(props.id);
  });
  return (
    <Show when={isExistInCurrentVersion()}>
      <Mask>
        <Text>裝備不存在此版本或無法讀取</Text>
      </Mask>
    </Show>
  );
};

const Mask = styled('div', {
  base: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    bg: 'bg.muted',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
