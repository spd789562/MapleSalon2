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
// import { ActionSelect } from './ActionSelect';
// import { ResetButton } from './ResetButton';
// import { SaveButton } from './SaveButton';
import { ExportAnimationButton } from './ExportAnimationButton';
import { OpenCharacterSelectionButton } from './OpenCharacterSelectionButton';
import { ExportProgress } from './ExportProgress';
import { ChairTabProvider } from './ChairTabContext';

export const ChairTab = () => {
  return (
    <ChairTabProvider>
      <ChairTabCard>
        <HStack justify="center" mb="2">
          <Box width="32">
            <ExpressionSelect />
          </Box>
          <OpenCharacterSelectionButton />
          <EffectSwitch />
        </HStack>
        <CharacterScene />
        <HStack mt="2" pl="2">
          <NameInput />
          <NameTagSwitch />
          <ChatBalloonInput />
          <ChatBalloonSwitch />
          <ExportAnimationButton />
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
  },
});
