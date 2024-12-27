import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $preserveOriginalDye } from '@/store/toolTab';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { IconTooltop, IconType } from '@/components/elements/IconTooltip';

export const PreserveDyeSwitch = () => {
  const t = useTranslate();
  const checked = useStore($preserveOriginalDye);

  function handleChange(details: ChangeDetails) {
    $preserveOriginalDye.set(details.checked);
  }

  return (
    <Switch checked={checked()} onCheckedChange={handleChange}>
      <HStack gap="1">
        <Text>{t('dye.preserveOriginalDye')}</Text>
        <IconTooltop
          type={IconType.Question}
          tooltip={t('dye.preserveOriginalDyeTip')}
        />
      </HStack>
    </Switch>
  );
};
