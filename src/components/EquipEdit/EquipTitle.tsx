import { type JSX, Show } from 'solid-js';

import { HStack } from 'styled-system/jsx/hstack';
import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';
import { SyncSkinChangeSwitch } from './SyncSkinChangeSwitch';

import { isSkinPartId } from '@/utils/itemId';

export interface EquipTitleProps {
  id: number;
  name: string;
  tags: JSX.Element;
}
export const EquipTitle = (props: EquipTitleProps) => {
  return (
    <HStack>
      <LoadableEquipIcon id={props.id} name={props.name} width="6" height="6" />
      <p>
        {props.name}
        {props.tags}
      </p>
      <Show when={isSkinPartId(props.id)}>
        <SyncSkinChangeSwitch />
      </Show>
    </HStack>
  );
};
