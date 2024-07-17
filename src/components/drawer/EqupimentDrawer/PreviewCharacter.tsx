import { createMemo } from 'solid-js';

import type { CharacterItems } from '@/store/character/store';

import { SimpleCharacter } from '@/components/SimpleCharacter';

import { getCharacterSubCategory } from '@/store/character/utils';
import { getSubCategory, getBodyId } from '@/utils/itemId';

export interface PreviewCharacterProps {
  name: string;
  id: number;
}
export const PreviewCharacter = (props: PreviewCharacterProps) => {
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

  return <SimpleCharacter title={props.name} items={subCategory()} />;
};
