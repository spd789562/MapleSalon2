import type { JSX } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import type { DyeType } from '@/const/toolTab';

interface DyeCharacterProps {
  url: string;
  dyeData: Partial<Record<DyeType, number>>;
  handleDyeClick: (data: Partial<Record<DyeType, number>>) => void;
  ref?: (element: HTMLImageElement) => void;
  dyeInfo: JSX.Element;
}
export const DyeCharacter = (props: DyeCharacterProps) => {
  function handleSelect() {
    props.handleDyeClick(props.dyeData);
  }
  function getDyeString() {
    return Object.entries(props.dyeData)
      .map(([key, value]) => `${key}-${value}`)
      .join(', ');
  }

  return (
    <CharacterItemContainer onClick={handleSelect}>
      <CharacterItemImage
        ref={props.ref}
        src={props.url}
        alt={`character-${getDyeString()}`}
        title={`item-dye-${getDyeString()}`}
      />
      <DyeInfoPositioner>{props.dyeInfo}</DyeInfoPositioner>
    </CharacterItemContainer>
  );
};

const CharacterItemContainer = styled('button', {
  base: {
    display: 'inline-block',
    position: 'relative',
    _hover: {
      '& [data-part="info"]': {
        opacity: 0.9,
      },
    },
  },
});

const CharacterItemImage = styled('img', {
  base: {
    maxWidth: 'unset',
    width: 'unset',
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
