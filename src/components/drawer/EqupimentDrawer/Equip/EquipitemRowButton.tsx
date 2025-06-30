import { styled } from 'styled-system/jsx/factory';

import type { EquipItem } from '@/store/string';
import { selectNewItem } from '@/store/character/action';

import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';
import { Text } from '@/components/ui/text';
import { PureTextClipboard } from '@/components/ui/clipboard';
import { AddToFavoriteButton } from './AddToFavoriteButton';

import { byteLength } from '@/utils/string';

export const rowFontSize = (text: string) => {
  const len = byteLength(text);
  return len > 28 ? '0.85rem' : '1rem';
};

export interface EquipItemRowButtonProps {
  item: EquipItem;
}
export const EquipItemRowButton = (props: EquipItemRowButtonProps) => {
  function handleClick() {
    selectNewItem({ ...props.item });
  }
  function preventDefault(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <EquipItemButtonContainer type="button" onClick={handleClick}>
      <LoadableEquipIcon
        id={props.item.id}
        name={props.item.name}
        isDyeable={props.item.isDyeable}
      />
      <EquipItemId onClick={preventDefault}>
        <PureTextClipboard value={props.item.id.toString()} />
      </EquipItemId>
      <EquipItemName
        onClick={preventDefault}
        style={{ 'font-size': rowFontSize(props.item.name) }}
      >
        <PureTextClipboard value={props.item.name} />
      </EquipItemName>
      <AddToFavoriteButton id={props.item.id} item={props.item} />
    </EquipItemButtonContainer>
  );
};

const EquipItemButtonContainer = styled('button', {
  base: {
    width: 'full',
    height: 'full',
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr auto',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      bg: 'gray.3',
    },
  },
});

const EquipItemId = styled(Text, {
  base: {
    width: '7rem',
    cursor: 'pointer',
    '&:hover': {
      color: 'colorPalette.10',
    },
  },
});

const EquipItemName = styled(Text, {
  base: {
    textAlign: 'left',
    cursor: 'pointer',
    '&:hover': {
      color: 'colorPalette.10',
    },
    lineHeight: '1',
  },
});
