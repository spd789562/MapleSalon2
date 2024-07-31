import type { JSX } from 'solid-js';

import { HStack } from 'styled-system/jsx/hstack';
import { LoadableEquipIcon } from '@/components/LoadableEquipIcon';

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
    </HStack>
  );
};
