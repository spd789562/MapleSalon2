import { createMemo } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import type { CharacterItems } from '@/store/character/store';

import { SimpleCharacter } from '@/components/SimpleCharacter';

import { getCharacterSubCategory } from '@/store/character/utils';
import { getSubCategory, getBodyId, getGender } from '@/utils/itemId';

export interface PreviewCharacterProps {
  name: string;
  id: number;
}
export const PreviewCharacter = (props: PreviewCharacterProps) => {
  const gender = createMemo(() => getGender(props.id));
  const subCategory = createMemo(() => {
    const baseItems: Partial<CharacterItems> = {
      Head: {
        id: 2000,
      },
      Body: {
        id: 12000,
      },
    };

    const category = getSubCategory(props.id);

    if (!category) {
      return baseItems;
    }

    const characterCategory = getCharacterSubCategory(category);

    if (characterCategory === 'Skin') {
      return {
        Head: {
          name: props.name,
          id: props.id,
        },
        Body: {
          name: props.name,
          id: getBodyId(props.id),
        },
      } as Partial<CharacterItems>;
    }

    baseItems[characterCategory] = {
      name: props.name,
      id: props.id,
    };

    return baseItems;
  });

  return (
    <CharacterContainer gender={gender()}>
      <SimpleCharacter
        title={props.name}
        items={subCategory()}
        itemContext={{
          id: props.id,
          name: props.name,
        }}
      />
    </CharacterContainer>
  );
};

const CharacterContainer = styled('div', {
  base: {
    width: 'full',
    height: 'full',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 'md',
  },
  variants: {
    gender: {
      0: {
        backgroundColor: 'iris.a5',
      },
      1: {
        backgroundColor: 'tomato.a5',
      },
      2: {
        backgroundColor: 'transparent',
      },
    },
  },
});
