import { styled } from 'styled-system/jsx/factory';

import { HStack } from 'styled-system/jsx/hstack';
import { Box } from 'styled-system/jsx/box';
import { ExpressionSelect } from '@/components/CharacterPreview/ExpressionSelect';
import { CharacterScene } from './CharacterScene';
import { NameInput } from '@/components/CharacterPreview/NameInput';
import { NameTagSwitch } from '@/components/CharacterPreview/NameTagSwitch';
import { MountActionSelect } from './MountActionSelect';
import { ExportAnimationButton } from './ExportAnimationButton';
import { OpenCharacterSelectionButton } from '@/components/tab/ChairTab/OpenCharacterSelectionButton';
import { ExportProgress } from './ExportProgress';
import { MountTabProvider } from './MountTabContext';

export const MountTab = () => {
  return (
    <MountTabProvider>
      <MountTabCard>
        <HStack justify="center" mb="2">
          <Box width="48">
            <MountActionSelect />
          </Box>
          <Box width="32">
            <ExpressionSelect />
          </Box>
          <OpenCharacterSelectionButton />
          {/* <AnimatingSwitch /> */}
        </HStack>
        <CharacterScene />
        <HStack mt="2" pl="2">
          <NameInput />
          <NameTagSwitch />
          <ExportAnimationButton />
          {/* <HStack marginLeft="auto">
            <ResetButton />
            <SaveButton />
          </HStack> */}
        </HStack>
        <ExportProgress />
      </MountTabCard>
    </MountTabProvider>
  );
};

const MountTabCard = styled('div', {
  base: {
    p: 2,
    borderRadius: 'lg',
    boxShadow: 'lg',
    bg: 'bg.default',
    position: 'relative',
    overflow: 'hidden',
  },
});
