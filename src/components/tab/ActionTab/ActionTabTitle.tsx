import { styled } from 'styled-system/jsx/factory';

import { VStack } from 'styled-system/jsx/vstack';
import { HStack } from 'styled-system/jsx/hstack';
import { Divider } from 'styled-system/jsx/divider';
import { Heading } from '@/components/ui/heading';
import { ExportTypeToggleGroup } from './ExportTypeToggleGroup';
import { ExportHandTypeToggleGroup } from './ExportHandTypeToggleGroup';
import { ExportAnimateButton } from './ExportAnimateButton';
import { ExportFrameButton } from './ExportFrameButton';
import { ForceExportEffectSwitch } from './ForceExportEffectSwitch';
import type { ActionCharacterRef } from './ActionCharacter';

export interface ActionTabTitleProps {
  characterRefs: ActionCharacterRef[];
}
export const ActionTabTitle = (props: ActionTabTitleProps) => {
  return (
    <TitleContainer>
      <VStack alignItems="flex-start">
        <Heading size="xl">動作預覽</Heading>
      </VStack>
      <HStack marginLeft="auto">
        <ForceExportEffectSwitch />
        <Divider height="2rem" orientation="vertical" />
        <HStack>
          <div>手勢</div>
          <ExportHandTypeToggleGroup />
        </HStack>
        <Divider height="2rem" orientation="vertical" />
        <HStack>
          <div>動圖格式</div>
          <ExportTypeToggleGroup />
        </HStack>
        <ExportAnimateButton characterRefs={props.characterRefs} />
        <ExportFrameButton characterRefs={props.characterRefs} />
      </HStack>
    </TitleContainer>
  );
};

export const TitleContainer = styled(HStack, {
  base: {
    px: 4,
    py: 2,
    borderRadius: 'md',
    boxShadow: 'md',
    backgroundColor: 'bg.default',
    width: '100%',
    flexWrap: 'wrap',
  },
});
