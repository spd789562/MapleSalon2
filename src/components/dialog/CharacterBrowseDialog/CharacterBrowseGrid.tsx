import { styled } from 'styled-system/jsx/factory';
import { usePureStore } from '@/store';

import {
  $filteredCharacterIds,
  type SaveCharacterData,
} from '@/store/characterDrawer';

import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { CharacterItem } from '@/components/drawer/CharacterSelectionDrawer/CharacterItem';

const DEFAULT_ITEM_HEIGHT = 125;
const DEFAULT_COLUMN_COUNT = 7;

export interface CharacterBrowseGridProps {
  columnCount?: number;
  onSelect: (data: SaveCharacterData) => void;
}
export const CharacterBrowseGrid = (props: CharacterBrowseGridProps) => {
  const characterIds = usePureStore($filteredCharacterIds);

  return (
    <RowVirtualizer
      defaultItemHeight={DEFAULT_ITEM_HEIGHT}
      columnCount={props.columnCount ?? DEFAULT_COLUMN_COUNT}
      renderItem={(id) => (
        <CharacterContainer>
          <CharacterItem id={id} onSelect={props.onSelect} />
        </CharacterContainer>
      )}
      data={characterIds()}
    />
  );
};

const CharacterContainer = styled('div', {
  base: {
    width: '100%',
    height: '100%',
    padding: '8px',
    position: 'relative',
  },
});
