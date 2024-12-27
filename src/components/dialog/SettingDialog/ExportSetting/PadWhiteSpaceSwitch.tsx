import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import {
  $padWhiteSpaceWhenExportFrame,
  setPadWhiteSpaceWhenExportFrame,
} from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';

export const PadWhiteSpaceSwitch = () => {
  const t = useTranslate();
  const padWhiteSpaceWhenExportFrame = useStore($padWhiteSpaceWhenExportFrame);

  function handleChange(details: ChangeDetails) {
    setPadWhiteSpaceWhenExportFrame(details.checked);
  }

  return (
    <Switch
      checked={padWhiteSpaceWhenExportFrame()}
      onCheckedChange={handleChange}
    >
      <HStack gap="1">
        <Text>{t('setting.frameRemainSpace')}</Text>
        <SettingTooltip tooltip={t('setting.frameRemainSpaceTip')} />
      </HStack>
    </Switch>
  );
};
