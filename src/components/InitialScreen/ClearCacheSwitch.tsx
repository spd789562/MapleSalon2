import { useTranslate } from '@/context/i18n';
import { useStore } from '@nanostores/solid';

import {
  $clearCacheWhenLoad,
  setClearCacheWhenLoad,
} from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';

export const ClearCacheSwitch = () => {
  const t = useTranslate();
  const checked = useStore($clearCacheWhenLoad);

  function handleChange(details: ChangeDetails) {
    setClearCacheWhenLoad(details.checked);
  }

  return (
    <Switch checked={checked()} onCheckedChange={handleChange}>
      <HStack gap="1">
        <Text size="sm">{t('initial.clearCache')}</Text>
        <SettingTooltip tooltip={t('initial.clearCacheTip')} />
      </HStack>
    </Switch>
  );
};
