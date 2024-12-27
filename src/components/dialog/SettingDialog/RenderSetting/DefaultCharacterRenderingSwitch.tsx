import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import {
  $defaultCharacterRendering,
  setDefaultCharacterRendering,
} from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';

export const DefaultCharacterRenderingSwitch = () => {
  const t = useTranslate();
  const defaultCharacterRendering = useStore($defaultCharacterRendering);

  function handleChange(details: ChangeDetails) {
    setDefaultCharacterRendering(details.checked);
  }

  return (
    <Switch
      checked={defaultCharacterRendering()}
      onCheckedChange={handleChange}
    >
      <HStack gap="1">
        <Text>{t('setting.defaultCharacterRender')}</Text>
        <SettingTooltip tooltip={t('setting.defaultCharacterRenderTip')} />
      </HStack>
    </Switch>
  );
};
