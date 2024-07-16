import { styled } from 'styled-system/jsx/factory';

import { HStack } from 'styled-system/jsx/hstack';
import { Box } from 'styled-system/jsx/box';
import { HandTypeToggleGroup } from './HandTypeToggleGroup';
import { EarTypeToggleGroup } from './EarTypeToggleGroup';
import { ExpressionSelect } from './ExpressionSelect';
import { ActionSelect } from './ActionSelect';
import { AnimatingSwitch } from './AnimatingSwitch';
import { CharacterScene } from './CharacterScene';

export const CharacterPreview = () => {
  return (
    <CharacterPreviewCard>
      <HStack justify="center" mb="2">
        <HandTypeToggleGroup />
        <EarTypeToggleGroup />
        <Box width="48">
          <ExpressionSelect />
        </Box>
        <Box width="48">
          <ActionSelect />
        </Box>
        <AnimatingSwitch />
      </HStack>
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
