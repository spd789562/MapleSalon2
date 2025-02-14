import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $preservePin, setPreservePin } from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';

export const PreservePinSwitch = () => {
  const t = useTranslate();
  const preservePin = useStore($preservePin);

  function handleChange(details: ChangeDetails) {
    setPreservePin(details.checked);
  }

  return (
    <Switch checked={preservePin()} onCheckedChange={handleChange}>
      <HStack gap="1">
        <Text>{t('setting.preservePinStatus')}</Text>
        <SettingTooltip tooltip={t('setting.preservePinStatusTip')} />
      </HStack>
    </Switch>
  );
};
