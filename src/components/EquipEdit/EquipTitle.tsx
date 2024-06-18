import { HStack } from 'styled-system/jsx';
import { LoadableEquipIcon } from '@/components/LoadableEquipIcon';

export interface EquipTitleProps {
  id: number;
  name: string;
}
export const EquipTitle = (props: EquipTitleProps) => {
  return (
    <HStack>
      <LoadableEquipIcon id={props.id} name={props.name} width="6" height="6" />
      <p>{props.name}</p>
    </HStack>
  );
};
