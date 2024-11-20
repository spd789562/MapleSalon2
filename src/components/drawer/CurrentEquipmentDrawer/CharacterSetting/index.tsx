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
  return (
    <VStack px="2" py="4" gap={4} alignItems="flex-start">
      <NameInput id="setting-name" />
      <NameTagSwitch />
      <ChatBalloonInput id="setting-chat" />
      <ChatBalloonSwitch />
      <AnimatingSwitch />
      <SimpleField label="手勢">
        <HandTypeToggleGroup />
      </SimpleField>
      <SimpleField label="耳型">
        <EarTypeToggleGroup />
      </SimpleField>
      <SimpleField label="表情" width="40">
        <ExpressionSelect />
      </SimpleField>
      <SimpleField label="動作" width="40">
        <ActionSelect />
      </SimpleField>
    </VStack>
  );
};
