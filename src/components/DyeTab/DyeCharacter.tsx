import { createMemo } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { usePureStore } from '@/store';

import type { CharacterItemInfo } from '@/store/character/store';
import { $totalItems } from '@/store/character/selector';

import { SimpleCharacter } from '@/components/SimpleCharacter';

import type { DyeColor } from '@/renderer/character/const/data';

interface DyeCharacterProps {
  category: 'Hair' | 'Face';
  hairOverrideId: number;
  dyeId?: number;
  dyeAlpha?: number;
  showFullCharacter?: boolean;
}
export const DyeCharacter = (props: DyeCharacterProps) => {
  const totalItems = usePureStore($totalItems);

  const overrideData = createMemo(() => {
    const ovrrideId = props.hairOverrideId;
    const category = props.category;
    const dyeId = props.dyeId;
    const dyeAlpha = props.dyeAlpha;
    const data: CharacterItemInfo = {
      id: ovrrideId,
      isDeleteDye: dyeId === undefined,
    };
    if (dyeId !== undefined) {
      data.dye = {
        color: dyeId as DyeColor,
        alpha: dyeAlpha ?? 50,
      };
    }
    return {
      [category]: data,
    };
  });

  return (
    <CharacterItemContainer isBox={!props.showFullCharacter}>
      <CharacterItemImage isBox={!props.showFullCharacter}>
        <SimpleCharacter
          title={`dyeid-${props.hairOverrideId}`}
          items={totalItems()}
          itemsOverride={overrideData()}
          noMaxWidth={true}
          useOffset={!props.showFullCharacter}
        />
      </CharacterItemImage>
    </CharacterItemContainer>
  );
};

const CharacterItemContainer = styled('div', {
  base: {
    display: 'inline-block',
    position: 'relative',
    overflow: 'hidden',
  },
  variants: {
    isBox: {
      true: {
        height: '7.5rem',
        width: '5rem',
      },
    },
  },
});

const CharacterItemImage = styled('button', {
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  variants: {
    isBox: {
      true: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      },
    },
  },
});
