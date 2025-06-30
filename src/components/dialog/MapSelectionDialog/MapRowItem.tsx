import { styled } from 'styled-system/jsx/factory';

import { $selectedMap, type MapItem } from '@/store/mapleMap';

import { Text } from '@/components/ui/text';

export interface MapRowItemProps {
  selected: boolean;
  item: MapItem;
}
export const MapRowItem = (props: MapRowItemProps) => {
  function handleClick() {
    if (!props.selected) {
      $selectedMap.set({ ...props.item });
    }
  }

  return (
    <MapItemContainer
      type="button"
      data-selected={props.selected ? true : undefined}
      onClick={handleClick}
    >
      <MapId>{props.item.id}</MapId>
      <MapName>
        <Text>{props.item.name}</Text>
      </MapName>
    </MapItemContainer>
  );
};

const MapItemContainer = styled('button', {
  base: {
    width: 'full',
    height: 'full',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      bg: 'gray.3',
    },
    _selected: {
      bg: 'colorPalette.3',
      '&:hover': {
        bg: 'colorPalette.3',
      },
    },
  },
});

const MapId = styled(Text, {
  base: {
    width: '7rem',
  },
});

const MapName = styled(Text, {
  base: {
    textAlign: 'left',
    lineHeight: '1',
  },
});
