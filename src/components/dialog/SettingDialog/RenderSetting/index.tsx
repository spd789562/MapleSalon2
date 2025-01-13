import { useTranslate } from '@/context/i18n';

import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { SimpleCharacterRenderCountInput } from './SimpleCharacterRenderCountInput';
import { DefaultCharacterRenderingSwitch } from './DefaultCharacterRenderingSwitch';
import { ShowItemGenderSwitch } from './ShowItemGenderSwitch';
import { ShowItemDyeableSwitch } from './ShowItemDyeableSwitch';
import { ItemEffectPreview } from './ItemEffectPreview';
import { UpscaleSwitch } from './UpscaleSwitch';
import { PreferRendererToggleGroup } from './PreferRendererToggleGroup';
import { PreferScaleModeToggleGroup } from './PreferScaleModeToggleGroup';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';

export const RenderSetting = () => {
  const t = useTranslate();
  return (
    <Stack>
      <Heading size="lg">{t('setting.renderTitle')}</Heading>
      <HStack gap="7">
        <HStack gap="2">
          <Text>{t('setting.renderer')}</Text>
          <SettingTooltip tooltip={t('setting.rendererTip')} />
          <PreferRendererToggleGroup />
        </HStack>
        <UpscaleSwitch />
      </HStack>
      <HStack gap="7">
        <HStack gap="2">
          <Text>{t('setting.scaleMode')}</Text>
          <SettingTooltip tooltip={t('setting.scaleModeTip')} />
          <PreferScaleModeToggleGroup />
        </HStack>
      </HStack>
      <HStack justify="space-between">
        <DefaultCharacterRenderingSwitch />
        <HStack gap="1">
          <Text>{t('setting.characterConcurrentRender')}</Text>
          <SettingTooltip tooltip={t('setting.characterConcurrentRenderTip')} />
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
