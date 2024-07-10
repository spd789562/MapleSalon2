import { createMemo, createSignal, Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { useDynamicPureStore } from '@/store';
import {
  createGetCharacterById,
  removeCharacter,
  cloneCharacter,
} from '@/store/characterDrawer';

import { CharacterActionMenu } from './CharacterActionMenu';
import { SimpleCharacter } from '@/components/SimpleCharacter';

export interface CharacterItemProps {
  id: string;
}
export const CharacterItem = (props: CharacterItemProps) => {
  const [open, setOpen] = createSignal(false);

  const getCharacterById = createMemo(() => createGetCharacterById(props.id));
  const characterData = useDynamicPureStore(getCharacterById);

  const handleSelect = () => {
    setOpen(!open());
  };

  const handleClone = () => {
    cloneCharacter(props.id);
  };

  const handleRemove = () => {
    removeCharacter(props.id);
  };

  return (
    <Show when={characterData()}>
      {(character) => (
        <CharacterItemContainer onClick={handleSelect}>
          <CharacterItemImage>
            <CharacterItemPositioner>
              <SimpleCharacter
                title={character().name}
                items={character().items}
                earType={character().earType}
                handType={character().handType}
              />
            </CharacterItemPositioner>
          </CharacterItemImage>
          <CharacterActionMenu name={character().name} open={open()} />
        </CharacterItemContainer>
      )}
    </Show>
  );
};

const CharacterItemContainer = styled('button', {
  base: {
    height: 'full',
    flexBasis: '5rem',
    flexShrink: 0,
    position: 'relative',
    borderRadius: 'md',
    boxShadow: 'md',
    cursor: 'pointer',
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
  },
});

const CharacterItemPositioner = styled('div', {
  base: {
    position: 'absolute',
  },
});
