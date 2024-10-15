import { styled } from 'styled-system/jsx/factory';

import { HStack } from 'styled-system/jsx/hstack';
import { Box } from 'styled-system/jsx/box';
import { HandTypeToggleGroup } from './HandTypeToggleGroup';
import { EarTypeToggleGroup } from './EarTypeToggleGroup';
import { ExpressionSelect } from './ExpressionSelect';
import { ActionSelect } from './ActionSelect';
import { AnimatingSwitch } from './AnimatingSwitch';
import { CharacterScene } from './CharacterScene';
import { NameInput } from './NameInput';
import { NameTagSwitch } from './NameTagSwitch';
import { ResetButton } from './ResetButton';
import { SaveButton } from './SaveButton';
import { ExportAnimationButton } from './ExportAnimationButton';
import { ExportProgress } from './ExportProgress';
import { CharacterPreviewProvider } from './CharacterPreviewContext';

export const CharacterPreview = () => {
  return (
    <CharacterPreviewProvider>
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
        <HStack mt="2" pl="2">
          <NameInput />
          <NameTagSwitch />
          <ExportAnimationButton />
          <HStack marginLeft="auto">
            <ResetButton />
            <SaveButton />
          </HStack>
        </HStack>
        <ExportProgress />
      </CharacterPreviewCard>
    </CharacterPreviewProvider>
  );
};

const CharacterPreviewCard = styled('div', {
  base: {
    p: 2,
    borderRadius: 'lg',
    boxShadow: 'lg',
    bg: 'bg.default',
    position: 'relative',
    overflow: 'hidden',
  },
});
