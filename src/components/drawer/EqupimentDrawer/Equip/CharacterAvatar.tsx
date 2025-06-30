import { createMemo } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';
import { useStore } from '@nanostores/solid';

import type { CharacterItems } from '@/store/character/store';
import { $showItemGender } from '@/store/settingDialog';

import { SimpleCharacter } from '@/components/SimpleCharacter';

import { getCharacterSubCategory } from '@/store/character/utils';
import { getSubCategory, getBodyId, getGender } from '@/utils/itemId';
import { Gender } from '@/utils/itemId';

export interface CharacterAvatarProps {
  name: string;
  id: number;
}
export const CharacterAvatar = (props: CharacterAvatarProps) => {
  const showItemGender = useStore($showItemGender);
  const gender = createMemo(() =>
    showItemGender() ? getGender(props.id) : Gender.Share,
  );
  const subCategory = createMemo(() => {
    const baseItems: Partial<CharacterItems> = {
      Head: {
        id: 12000,
      },
      Body: {
        id: 2000,
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
        backgroundColor: 'iris.a4',
      },
      1: {
        backgroundColor: 'tomato.a4',
      },
      2: {
        backgroundColor: 'transparent',
      },
      3: {
        backgroundColor: 'transparent',
      },
    },
  },
});
