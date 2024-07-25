import { createMemo, For } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { usePureStore } from '@/store';

import {
  $totalItems,
  createEquipItemByCategory,
} from '@/store/character/selector';
import { getUpdateItems } from '@/store/character/utils';

import * as Table from '@/components/ui/table';
import { SimpleCharacter } from '@/components/SimpleCharacter';

import { gatHairAvailableColorIds, getHairColorId } from '@/utils/mixDye';

import { HairColorHex } from '@/const/hair';

const $hairItem = createEquipItemByCategory('Hair');

export const HairColorTable = () => {
  const hairItem = usePureStore($hairItem);

  const avaialbeHairColorIds = createMemo(() => {
    const hairId = hairItem()?.id;
    if (!hairId) {
      return [];
    }
    return gatHairAvailableColorIds(hairId);
  });

  const colorList = createMemo(() => {
    return avaialbeHairColorIds().map(
      (colorId) => HairColorHex[getHairColorId(colorId)],
    );
  });

  return (
    <Table.Root>
      <Table.Head>
        <Table.Row>
          <For each={colorList()}>
            {(colorHex) => (
              <Table.Header textAlign="center">
                <ColorBlock style={{ 'background-color': colorHex }} />
              </Table.Header>
            )}
          </For>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        <Table.Row>
          <For each={avaialbeHairColorIds()}>
            {(colorHex) => (
              <Table.Cell overflow="hidden" textAlign="center">
                <HairDyeCharacter category="Hair" hairOverrideId={colorHex} />
              </Table.Cell>
            )}
          </For>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};

interface HairDyeCharacterProps {
  category: 'Hair' | 'Face';
  hairOverrideId: number;
}
const HairDyeCharacter = (props: HairDyeCharacterProps) => {
  const totalItems = usePureStore($totalItems);

  const characterData = createMemo(() => {
    const ovrrideId = props.hairOverrideId;
    const category = props.category;
    return getUpdateItems(totalItems(), {
      [category]: {
        id: ovrrideId,
        isDeleteDye: true,
      },
    });
  });

  return (
    <CharacterItemContainer>
      <CharacterItemImage>
        <SimpleCharacter
          title={`dyeid-${props.hairOverrideId}`}
          items={characterData()}
          noMaxWidth={true}
          useOffset={true}
        />
      </CharacterItemImage>
    </CharacterItemContainer>
  );
};

const ColorBlock = styled('div', {
  base: {
    borderRadius: 'md',
    w: 6,
    h: 6,
    display: 'inline-block',
  },
});

const CharacterItemContainer = styled('div', {
  base: {
    display: 'inline-block',
    height: '7.5rem',
    width: '5rem',
    position: 'relative',
    overflow: 'hidden',
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
    cursor: 'pointer',
  },
});
