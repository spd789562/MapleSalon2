import { createMemo, type JSX } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { usePureStore } from '@/store';

import type { CharacterItemInfo } from '@/store/character/store';
import { $totalItems } from '@/store/character/selector';

import { SimpleCharacter } from '@/components/SimpleCharacter';

import type { DyeColor } from '@/renderer/character/const/data';

interface DyeCharacterProps {
  category: 'Hair' | 'Face';
  ovrrideId: number;
  dyeId?: number;
  dyeAlpha?: number;
  showFullCharacter?: boolean;
  dyeInfo?: JSX.Element;
}
export const DyeCharacter = (props: DyeCharacterProps) => {
  const totalItems = usePureStore($totalItems);

  const overrideData = createMemo(() => {
    const ovrrideId = props.ovrrideId;
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
          title={`dyeid-${props.ovrrideId}`}
          items={totalItems()}
          itemsOverride={overrideData()}
          noMaxWidth={true}
          useOffset={!props.showFullCharacter}
        />
      </CharacterItemImage>
      <DyeInfoPositioner>{props.dyeInfo}</DyeInfoPositioner>
    </CharacterItemContainer>
  );
};

const CharacterItemContainer = styled('button', {
  base: {
    display: 'inline-block',
    position: 'relative',
    overflow: 'hidden',
    _hover: {
      '& [data-part="info"]': {
        opacity: 0.9,
      },
    },
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

const CharacterItemImage = styled('div', {
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

const DyeInfoPositioner = styled('div', {
  base: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
