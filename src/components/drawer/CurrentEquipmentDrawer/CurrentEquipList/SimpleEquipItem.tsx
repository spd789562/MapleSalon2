import { Show, createMemo } from 'solid-js';

import { getEquipById } from '@/store/string';

import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';
import { EllipsisText } from '@/components/ui/ellipsisText';
import {
  EquipItemContainer,
  EquipItemIcon,
  EquipItemName,
  EquipItemInfo,
} from './EquipItem';
import { EqipItemActions } from './EquipItemActions';
import { ItemNotExistMask } from './ItemNotExistMask';

export interface SimpleEquipItemProps {
  id?: number;
  handleEdit?: () => void;
  handleDelete?: () => void;
}
export const SimpleEquipItem = (props: SimpleEquipItemProps) => {
  const item = createMemo(() => {
    if (!props.id) {
      return undefined;
    }
    return getEquipById(props.id);
  });
  return (
    <Show when={item()}>
      {(item) => (
        <EquipItemContainer>
          <EquipItemIcon>
            <LoadableEquipIcon id={item().id} name={item().name} />
          </EquipItemIcon>
          <EquipItemInfo>
            <EquipItemName>
              <Show when={item().name} fallback={item().id}>
                <EllipsisText as="div" title={item().name}>
                  {item().name}
                </EllipsisText>
              </Show>
            </EquipItemName>
          </EquipItemInfo>
          <EqipItemActions
            onEdit={props.handleEdit}
            onDelete={props.handleDelete}
          />
          <ItemNotExistMask id={item().id} />
        </EquipItemContainer>
      )}
    </Show>
  );
};
