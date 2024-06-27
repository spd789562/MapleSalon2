import { Switch, Match, Show } from 'solid-js';
import { css } from 'styled-system/css';

import { HStack } from 'styled-system/jsx/hstack';

import type { ItemDyeInfo } from '@/renderer/character/const/data';
import { HairColorHex, type HairColorId } from '@/const/hair';
import { FaceColorHex, type FaceColorId } from '@/const/face';
import { isHairId, isFaceId } from '@/utils/itemId';
import { getHairColorId, getFaceColorId } from '@/utils/mixDye';

export interface EquipItemMixDyeInfoProps {
  id: number;
  dyeInfo?: ItemDyeInfo;
}
export const EquipItemMixDyeInfo = (props: EquipItemMixDyeInfoProps) => {
  return (
    <Show when={props.dyeInfo}>
      {(dyeInfo) => (
        <HStack
          flex="1"
          fontSize="xs"
          backgroundColor="bg.emphasized"
          borderRadius="sm"
          py={1}
          px={2}
          lineHeight="1"
        >
          <Switch>
            <Match when={isHairId(props.id)}>
              <ColorBlock color={HairColorHex[getHairColorId(props.id)]} />
              <span>+{100 - dyeInfo().alpha}</span>
              <ColorBlock
                color={HairColorHex[dyeInfo().color as HairColorId]}
              />
              <span>+{dyeInfo().alpha}</span>
            </Match>
            <Match when={isFaceId(props.id)}>
              <ColorBlock color={FaceColorHex[getFaceColorId(props.id)]} />
              <span>+{100 - dyeInfo().alpha}</span>
              <ColorBlock
                color={FaceColorHex[dyeInfo().color as FaceColorId]}
              />
              <span>+{dyeInfo().alpha}</span>
            </Match>
          </Switch>
        </HStack>
      )}
    </Show>
  );
};

interface ColorBlockProps {
  color: string;
}
const ColorBlock = (props: ColorBlockProps) => {
  return (
    <div
      class={css({
        borderRadius: 'sm',
        width: '3',
        height: '3',
        display: 'inline-block',
      })}
      style={{ 'background-color': props.color }}
    />
  );
};
