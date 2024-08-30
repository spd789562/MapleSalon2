import { createMemo, type JSX, from, Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import {
  $currentItem,
  $currentItemChanges,
  type CharacterItemInfo,
} from '@/store/character/store';
import { $totalItemsApplyDeletion } from '@/store/character/selector';
import { getEquipById } from '@/store/string';

import { SimpleCharacter } from '@/components/SimpleCharacter';

import type { DyeColor } from '@/renderer/character/const/data';

interface DyeCharacterProps {
  category: 'Hair' | 'Face';
  ovrrideId: number;
  dyeId?: number;
  dyeAlpha?: number;
  showFullCharacter?: boolean;
  dyeInfo?: JSX.Element;
  ref?: (element: HTMLImageElement) => void;
}
export const DyeCharacter = (props: DyeCharacterProps) => {
  /* don't know why it not reactive when use usePureStore, so just use from to subscribe the store */
  const totalItems = from($totalItemsApplyDeletion);

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

  function handleSelect() {
    const currentItem = totalItems()?.[props.category];
    let currentItemName = '';

    if (currentItem?.id !== props.ovrrideId) {
      /* if base hair get changed need to get new name */
      const equipInfo = getEquipById(props.ovrrideId);
      currentItemName = equipInfo?.name || equipInfo?.id?.toString() || '';
    } else {
      currentItemName = currentItem?.name || currentItem?.id?.toString() || '';
    }

    const data = {
      id: props.ovrrideId,
      name: currentItemName,
    };

    const isDeleteDye = props.dyeId === undefined;
    const dyeObject = isDeleteDye
      ? undefined
      : {
          color: props.dyeId as DyeColor,
          alpha: props.dyeAlpha ?? 50,
        };

    $currentItem.set(data);
    $currentItemChanges.setKey(props.category, {
      id: data.id,
      name: data.name,
      dye: dyeObject,
      isDeleted: false,
      isDeleteDye,
    } as CharacterItemInfo);
  }

  return (
    <CharacterItemContainer
      isBox={!props.showFullCharacter}
      onClick={handleSelect}
    >
      <CharacterItemImage isBox={!props.showFullCharacter}>
        <Show when={totalItems()}>
          {(items) => (
            <SimpleCharacter
              title={`dyeid-${props.ovrrideId}-${props.dyeId ?? ''}`}
              items={items()}
              itemsOverride={overrideData()}
              noMaxWidth={true}
              useOffset={!props.showFullCharacter}
              ref={props.ref}
            />
          )}
        </Show>
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
        height: '6.5rem',
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
