import { styled } from 'styled-system/jsx/factory';

import { HStack } from 'styled-system/jsx/hstack';
import { Box } from 'styled-system/jsx/box';
import { ExpressionSelect } from '@/components/CharacterPreview/ExpressionSelect';
import { CharacterScene } from './CharacterScene';
import { NameInput } from '@/components/CharacterPreview/NameInput';
import { NameTagSwitch } from '@/components/CharacterPreview/NameTagSwitch';
import { ChatBalloonInput } from '@/components/CharacterPreview/ChatBalloonInput';
import { ChatBalloonSwitch } from '@/components/CharacterPreview/ChatBalloonSwitch';
import { EffectSwitch } from './EffectSwitch';
import { CharacterVisibleSwitch } from './CharacterVisibleSwitch';
// import { ActionSelect } from './ActionSelect';
// import { ResetButton } from './ResetButton';
// import { SaveButton } from './SaveButton';
import { ExportAnimationButton } from './ExportAnimationButton';
import { ExportSnapshotButton } from './ExportSnapshotButton';
import { ExportSnapshotToClipboardButton } from './ExportSnapshotToClipboardButton';
import { OpenCharacterSelectionButton } from './OpenCharacterSelectionButton';
import { ExportProgress } from './ExportProgress';
import { ChairTabProvider } from './ChairTabContext';

export const ChairTab = () => {
  return (
    <ChairTabProvider>
      <ChairTabCard gridTemplateRows="auto 1fr auto">
        <HStack justify="center" mb="2">
          <Box width="32">
            <ExpressionSelect />
          </Box>
          <OpenCharacterSelectionButton />
          <EffectSwitch />
          <CharacterVisibleSwitch />
        </HStack>
        <CharacterScene />
        <HStack mt="2" pl="2" flexWrap="wrap">
          <NameInput />
          <NameTagSwitch />
          <ChatBalloonInput />
          <ChatBalloonSwitch />
          <HStack>
            <ExportAnimationButton />
            <ExportSnapshotButton />
            <ExportSnapshotToClipboardButton />
          </HStack>
        </HStack>
        <ExportProgress />
      </ChairTabCard>
    </ChairTabProvider>
  );
};

const ChairTabCard = styled('div', {
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
