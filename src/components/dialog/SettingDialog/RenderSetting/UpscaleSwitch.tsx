import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import {
  $enableExperimentalUpscale,
  setEnableExperimentalUpscale,
} from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';

export const UpscaleSwitch = () => {
  const t = useTranslate();
  const enableExperimentalUpscale = useStore($enableExperimentalUpscale);

  function handleChange(details: ChangeDetails) {
    setEnableExperimentalUpscale(details.checked);
  }

  return (
    <Switch
      checked={enableExperimentalUpscale()}
      onCheckedChange={handleChange}
    >
      <HStack gap="1">
        <Text>{t('setting.experimentalUpscale')}</Text>
        <SettingTooltip tooltip={t('setting.experimentalUpscaleTip')} />
      </HStack>
    </Switch>
  );
};
