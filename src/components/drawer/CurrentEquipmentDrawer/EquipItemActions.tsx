import { Show } from 'solid-js';

import { HStack } from 'styled-system/jsx/hstack';
import { IconButton } from '@/components/ui/icon-button';
import PencilIcon from 'lucide-solid/icons/pencil';
import Trash2Icon from 'lucide-solid/icons/trash-2';

export interface EqipItemActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
}
export const EqipItemActions = (props: EqipItemActionsProps) => {
  return (
    <HStack gap={1} paddingRight="1" marginLeft="auto">
      <Show when={props.onEdit}>
        <IconButton variant="ghost" size="xs" onClick={props.onEdit}>
          <PencilIcon />
        </IconButton>
      </Show>
      <Show when={props.onDelete}>
        <IconButton variant="ghost" size="xs" onClick={props.onDelete}>
          <Trash2Icon />
        </IconButton>
      </Show>
    </HStack>
  );
};
