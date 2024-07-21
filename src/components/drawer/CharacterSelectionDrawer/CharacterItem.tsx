import { createMemo, Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { useDynamicPureStore } from '@/store';
import { $hasAnyItemChanges } from '@/store/character/selector';

import {
  createGetCharacterById,
  selectCharacter,
  removeCharacter,
  cloneCharacter,
} from '@/store/characterDrawer';

import EllipsisVerticalIcon from 'lucide-solid/icons/ellipsis-vertical';
import { IconButton } from '@/components/ui/icon-button';
import { SimpleCharacter } from '@/components/SimpleCharacter';
import { CharacterActionMenu } from './CharacterActionMenu';
import type { SelectionDetails } from '@/components/ui/menu';

import { downloadJson } from '@/utils/download';

export interface CharacterItemProps {
  id: string;
}
export const CharacterItem = (props: CharacterItemProps) => {
  const getCharacterById = createMemo(() => createGetCharacterById(props.id));
  const characterData = useDynamicPureStore(getCharacterById);

  const handleSelect = () => {
    const data = characterData();
    if (!data) {
      return;
    }
    const hasChanges = $hasAnyItemChanges.get();
    if (hasChanges) {
      /* do something like popup */
    }

    selectCharacter(data);
  };

  const handleClone = () => {
    cloneCharacter(props.id);
  };

  const handleRemove = () => {
    removeCharacter(props.id);
  };

  const handleDownlaod = () => {
    const data = characterData();
    if (!data) {
      return;
    }
    downloadJson(data, `${data.name}.json`);
  };

  const handleMenuSelect = (details: SelectionDetails) => {
    if (details.value === 'clone') {
      handleClone();
    } else if (details.value === 'info') {
      console.warn('unimplemented');
    } else if (details.value === 'download') {
      handleDownlaod();
    } else if (details.value === 'delete') {
      handleRemove();
    }
  };

  return (
    <Show when={characterData()}>
      {(character) => (
        <CharacterItemContainer>
          <CharacterItemImage onClick={handleSelect}>
            <CharacterItemPositioner>
              <SimpleCharacter
                title={character().name}
                items={character().items}
                earType={character().earType}
                handType={character().handType}
                noMaxWidth={true}
                useOffset={true}
              />
            </CharacterItemPositioner>
          </CharacterItemImage>
          <CharacterActionMenu
            onSelect={handleMenuSelect}
            size="xs"
            name={character().name}
          >
            <IconButton
              size="xs"
              variant="ghost"
              position="absolute"
              zIndex="1"
              top="1"
              right="1"
            >
              <EllipsisVerticalIcon size={16} />
            </IconButton>
          </CharacterActionMenu>
        </CharacterItemContainer>
      )}
    </Show>
  );
};

const CharacterItemContainer = styled('div', {
  base: {
    height: 'full',
    flexBasis: '5rem',
    flexShrink: 0,
    position: 'relative',
    boxShadow: 'md',
    borderRadius: 'md',
  },
});

const CharacterItemImage = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    borderRadius: 'md',
    cursor: 'pointer',
  },
});

const CharacterItemPositioner = styled('div', {
  base: {
    position: 'absolute',
  },
});
