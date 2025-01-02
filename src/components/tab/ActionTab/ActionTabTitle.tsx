import { styled } from 'styled-system/jsx/factory';
import { useTranslate } from '@/context/i18n';

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
  const t = useTranslate();
  return (
    <TitleContainer>
      <VStack alignItems="flex-start">
        <Heading size="xl">{t('tab.actionPreview')}</Heading>
      </VStack>
      <HStack marginLeft="auto">
        <ForceExportEffectSwitch />
        <Divider height="2rem" orientation="vertical" />
        <HStack>
          <div>{t('character.handType')}</div>
          <ExportHandTypeToggleGroup />
        </HStack>
        <Divider height="2rem" orientation="vertical" />
        <HStack>
          <div>{t('export.animatFormat')}</div>
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
