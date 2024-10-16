import { styled } from 'styled-system/jsx/factory';

import type { EquipItem } from '@/store/string';
import { selectNewItem } from '@/store/character/action';

import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';
import { Text } from '@/components/ui/text';

export interface EquipItemRowButtonProps {
  item: EquipItem;
}
export const EquipItemRowButton = (props: EquipItemRowButtonProps) => {
  function handleClick() {
    selectNewItem({
      id: props.item.id,
      name: props.item.name,
      hasEffect: props.item.hasEffect,
      isDyeable: props.item.isDyeable,
      isNameTag: props.item.isNameTag,
    });
  }

  return (
    <EquipItemButtonContainer type="button" onClick={handleClick}>
      <LoadableEquipIcon
        id={props.item.id}
        name={props.item.name}
        isDyeable={props.item.isDyeable}
      />
      <EquipItemId>{props.item.id}</EquipItemId>
      <EquipItemName>{props.item.name}</EquipItemName>
    </EquipItemButtonContainer>
  );
};

const EquipItemButtonContainer = styled('button', {
  base: {
    width: 'full',
    height: 'full',
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr',
    alignItems: 'center',
  },
});

const EquipItemId = styled(Text, {
  base: {
    width: '6rem',
  },
});

const EquipItemName = styled(Text, {
  base: {
    textAlign: 'left',
  },
});
