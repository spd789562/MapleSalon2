import { createSelector, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { usePureStore } from '@/store';
import { styled } from 'styled-system/jsx/factory';

import {
  $getCharacterIds,
  type SaveCharacterData,
} from '@/store/characterDrawer';
import { $currentCharacterId } from '@/store/character/selector';

import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { CharacterItem } from '@/components/drawer/CharacterSelectionDrawer/CharacterItem';

const DEFAULT_ITEM_HEIGHT = 125;

export interface CharacterGridProps {
  columnCount: number;
  onSelect: (id: string) => void;
  selectedIds: string[];
}
export const CharacterGrid = (props: CharacterGridProps) => {
  const characterIds = usePureStore($getCharacterIds);
  const currentCharacterId = useStore($currentCharacterId);

  const isCurrent = createSelector(currentCharacterId);

  function getSelectIndex(id: string) {
    return props.selectedIds.indexOf(id);
  }

  function handleSelect(data: SaveCharacterData) {
    if (isCurrent(data.id)) {
      return;
    }
    props.onSelect(data.id);
  }

  return (
    <RowVirtualizer
      defaultItemHeight={DEFAULT_ITEM_HEIGHT}
      columnCount={props.columnCount}
      renderItem={(id) => (
        <CharacterContainer
          data-state={getSelectIndex(id) !== -1 || isCurrent(id) ? 'on' : 'off'}
          data-disabled={isCurrent(id) ? true : undefined}
        >
          <Show when={getSelectIndex(id) !== -1}>
            <CharacterSelectIndex class="select-index">
              {getSelectIndex(id) + 2}
            </CharacterSelectIndex>
          </Show>
          <Show when={isCurrent(id)}>
            <CharacterSelectIndex class="select-index">1</CharacterSelectIndex>
          </Show>
          <CharacterItem id={id} onSelect={handleSelect} />
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
    _before: {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: '4px',
      left: '4px',
      right: '4px',
      bottom: '4px',
      borderRadius: 'md',
    },
    _on: {
      _before: {
        borderWidth: '2px',
        borderRadius: 'md',
        borderColor: 'accent.8',
      },
      '& > .select-index': {
        backgroundColor: 'accent.8',
      },
    },
    _disabled: {
      _before: {
        borderColor: 'gray.8',
      },
      '& > .select-index': {
        backgroundColor: 'gray.8',
      },
    },
  },
});

const CharacterSelectIndex = styled('div', {
  base: {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '1rem',
    height: '1rem',
    borderRadius: 'sm',
    color: 'accent.fg',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'xs',
    zIndex: 5,
  },
});
