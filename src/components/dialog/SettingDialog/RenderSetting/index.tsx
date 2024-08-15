import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { SimpleCharacterRenderCountInput } from './SimpleCharacterRenderCountInput';
import { DefaultCharacterRenderingSwitch } from './DefaultCharacterRenderingSwitch';
import { ShowItemGenderSwitch } from './ShowItemGenderSwitch';
import { ShowItemDyeableSwitch } from './ShowItemDyeableSwitch';
import { ItemEffectPreview } from './ItemEffectPreview';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';

export const RenderSetting = () => {
  return (
    <Stack>
      <Heading size="lg">渲染設定</Heading>
      <HStack justify="space-between">
        <DefaultCharacterRenderingSwitch />
        <HStack gap="1">
          <Text>角色快照同時渲染數量</Text>
          <SettingTooltip tooltip="提升或降低角色快照同時渲染數量，過多可能造成應用程式渲染緩慢" />
          <SimpleCharacterRenderCountInput />
        </HStack>
      </HStack>
      <HStack gap="8">
        <ShowItemGenderSwitch />
        <ShowItemDyeableSwitch />
        <ItemEffectPreview />
      </HStack>
    </Stack>
  );
};
