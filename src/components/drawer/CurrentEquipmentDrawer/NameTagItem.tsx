import { Show, createMemo } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { openNameTagSelection } from '@/store/currentEquipDrawer';
import { $currentNameTagId } from '@/store/character/selector';
import { setCharacterNameTag } from '@/store/character/action';
import { getEquipById } from '@/store/string';

import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';
import { EllipsisText } from '@/components/ui/ellipsisText';
import {
  EquipItemContainer,
  EquipItemIcon,
  EquipItemName,
  EquipItemInfo,
} from '@/components/drawer/CurrentEquipmentDrawer/EquipItem';
import { EqipItemActions } from './EquipItemActions';
import { ItemNotExistMask } from './ItemNotExistMask';

export const NameTagItem = () => {
  const nameTagId = useStore($currentNameTagId);

  const item = createMemo(() => {
    const id = nameTagId();
    if (!id) {
      return undefined;
    }
    return getEquipById(id);
  });

  function handleEdit() {
    openNameTagSelection();
  }

  function handleDelete() {
    setCharacterNameTag(undefined);
  }

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
          <EqipItemActions onEdit={handleEdit} onDelete={handleDelete} />
          <ItemNotExistMask id={item().id} />
        </EquipItemContainer>
      )}
    </Show>
  );
};
