import { styled } from 'styled-system/jsx/factory';

import { HStack } from 'styled-system/jsx/hstack';
import { Box } from 'styled-system/jsx/box';
import { HandTypeToggleGroup } from './HandTypeToggleGroup';
import { EarTypeToggleGroup } from './EarTypeToggleGroup';
import { ExpressionSelect } from './ExpressionSelect';
import { ActionSelect } from './ActionSelect';
import { AnimatingSwitch } from './AnimatingSwitch';
import { CharacterScene } from './CharacterScene';
import { ResetButton } from './ResetButton';
import { SaveButton } from './SaveButton';

export const CharacterPreview = () => {
  return (
    <CharacterPreviewCard>
      <HStack justify="center" mb="2">
        <HandTypeToggleGroup />
        <EarTypeToggleGroup />
        <Box width="32">
          <ExpressionSelect />
        </Box>
        <Box width="32">
          <ActionSelect />
        </Box>
        <AnimatingSwitch />
      </HStack>
      <CharacterScene />
      <HStack mt="2">
        <HStack marginLeft="auto">
          <ResetButton />
          <SaveButton />
        </HStack>
      </HStack>
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
