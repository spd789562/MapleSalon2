import { styled } from 'styled-system/jsx/factory';

import { HStack } from 'styled-system/jsx/hstack';
import { Box } from 'styled-system/jsx/box';
import { ExtraPartsPopover } from './ExtraPartsPopover';
import { HandTypeToggleGroup } from './HandTypeToggleGroup';
import { EarTypeToggleGroup } from './EarTypeToggleGroup';
import { ExpressionSelect } from './ExpressionSelect';
import { ActionSelect } from './ActionSelect';
import { AnimatingSwitch } from './AnimatingSwitch';
import { ActionFrameNumberInput } from './ActionFrameNumberInput';
import { CharacterScene } from './CharacterScene';
import { NameInput } from './NameInput';
import { NameTagSwitch } from './NameTagSwitch';
import { ChatBalloonInput } from './ChatBalloonInput';
import { ChatBalloonSwitch } from './ChatBalloonSwitch';
import { ResetButton } from './ResetButton';
import { SaveButton } from './SaveButton';
import { ExportAnimationButton } from './ExportAnimationButton';
import { ExportFrameButton } from './ExportFrameButton';
import { ExportSnapshotButton } from './ExportSnapshotButton';
import { ExportSnapshotToClipboardButton } from './ExportSnapshotToClipboardButton';
import { ExportProgress } from './ExportProgress';
import { CharacterPreviewProvider } from './CharacterPreviewContext';

export const CharacterPreview = () => {
  return (
    <CharacterPreviewProvider>
      <CharacterPreviewCard id="character-preview-scene" gridTemplateRows="auto 1fr auto auto">
        <HStack justify="center" mb="2" flexWrap="wrap">
          <ExtraPartsPopover />
          <HandTypeToggleGroup />
          <EarTypeToggleGroup />
          <Box width="32">
            <ExpressionSelect />
          </Box>
          <Box width="32">
            <ActionSelect />
          </Box>
          <HStack>
            <AnimatingSwitch />
            <ActionFrameNumberInput />
          </HStack>
        </HStack>
        <CharacterScene />
        <HStack mt="2" pl="2" flexWrap="wrap">
          <NameInput />
          <NameTagSwitch />
          <ChatBalloonInput />
          <ChatBalloonSwitch />
        </HStack>
        <HStack mt="2" pl="2" flexWrap="wrap">
          <HStack id="character-preview-export-buttons">
            <ExportAnimationButton />
            <ExportFrameButton />
            <ExportSnapshotButton />
            <ExportSnapshotToClipboardButton />
          </HStack>
          <HStack id="character-preview-save-buttons" marginLeft="auto">
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
    display: 'grid',
  },
});
