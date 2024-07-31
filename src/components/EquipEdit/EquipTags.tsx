import { Show } from 'solid-js';

import type { EquipItem } from '@/store/string';

import { HStack } from 'styled-system/jsx/hstack';
import { Kbd } from '@/components/ui/kbd';

export interface EquipTagsProps {
  info?: EquipItem;
}
export const EquipTags = (props: EquipTagsProps) => {
  return (
    <Show when={props.info}>
      {(info) => (
        <HStack gap="1" ml="1" display="inline-flex">
          <Show when={info().isCash}>
            <Kbd size="sm">現金</Kbd>
          </Show>
          <Show when={info().isDyeable}>
            <Kbd size="sm">染色</Kbd>
          </Show>
          <Show when={info().hasEffect}>
            <Kbd size="sm">特效</Kbd>
          </Show>
        </HStack>
      )}
    </Show>
  );
};
