import { styled } from 'styled-system/jsx/factory';

import { VStack } from 'styled-system/jsx/vstack';
import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { ExportTypeToggleGroup } from './ExportTypeToggleGroup';
import { ExportAnimateButton } from './ExportAnimateButton';
import { ExportFrameButton } from './ExportFrameButton';
import type { ActionCharacterRef } from './ActionCharacter';

export interface ActionTabTitleProps {
  characterRefs: ActionCharacterRef[];
}
export const ActionTabTitle = (props: ActionTabTitleProps) => {
  return (
    <TitleContainer>
      <VStack alignItems="flex-start">
        <Heading size="2xl">動作預覽</Heading>
        <Text size="sm" color="fg.subtle">
          特效類因延遲幀數不同無法匯出
        </Text>
      </VStack>
      <HStack marginLeft="auto">
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
  },
});
