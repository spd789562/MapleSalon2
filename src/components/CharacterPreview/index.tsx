import { styled } from 'styled-system/jsx/factory';

import { CharacterScene } from '@/components/Character';

export const CharacterPreview = () => {
  return (
    <CharacterPreviewCard>
      <CharacterScene />
    </CharacterPreviewCard>
  );
};

const CharacterPreviewCard = styled('div', {
  base: {
    p: 2,
    borderRadius: 'lg',
    boxShadow: 'lg',
    bg: 'bg.default',
  },
});
