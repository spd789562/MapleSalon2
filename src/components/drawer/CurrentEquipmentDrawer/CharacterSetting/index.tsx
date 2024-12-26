import { useTranslate } from '@/context/i18n';

import { VStack } from 'styled-system/jsx/vstack';
import { SimpleField } from '@/components/ui/field';
import { NameInput } from '@/components/CharacterPreview/NameInput';
import { NameTagSwitch } from '@/components/CharacterPreview/NameTagSwitch';
import { ChatBalloonInput } from '@/components/CharacterPreview/ChatBalloonInput';
import { ChatBalloonSwitch } from '@/components/CharacterPreview/ChatBalloonSwitch';
import { HandTypeToggleGroup } from '@/components/CharacterPreview/HandTypeToggleGroup';
import { EarTypeToggleGroup } from '@/components/CharacterPreview/EarTypeToggleGroup';
import { ExpressionSelect } from '@/components/CharacterPreview/ExpressionSelect';
import { ActionSelect } from '@/components/CharacterPreview/ActionSelect';
import { AnimatingSwitch } from '@/components/CharacterPreview/AnimatingSwitch';

export const CharacterSetting = () => {
  const t = useTranslate();

  return (
    <VStack px="2" py="4" gap={4} alignItems="flex-start">
      <NameInput id="setting-name" />
      <NameTagSwitch />
      <ChatBalloonInput id="setting-chat" />
      <ChatBalloonSwitch />
      <AnimatingSwitch />
      <SimpleField label={t('character.handType')}>
        <HandTypeToggleGroup />
      </SimpleField>
      <SimpleField label={t('character.earType')}>
        <EarTypeToggleGroup />
      </SimpleField>
      <SimpleField label={t('character.expression')} width="40">
        <ExpressionSelect />
      </SimpleField>
      <SimpleField label={t('character.action')} width="40">
        <ActionSelect />
      </SimpleField>
    </VStack>
  );
};
