import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $forceExportEffect } from '@/store/toolTab';

import { HStack } from 'styled-system/jsx/hstack';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { IconTooltop, IconType } from '@/components/elements/IconTooltip';

export const ForceExportEffectSwitch = () => {
  const t = useTranslate();
  const isAnimating = useStore($forceExportEffect);

  function handleChange(details: ChangeDetails) {
    $forceExportEffect.set(details.checked);
  }

  return (
    <Switch checked={isAnimating()} onCheckedChange={handleChange}>
      <HStack>
        {t('export.forceExportEffect')}
        <IconTooltop
          type={IconType.Info}
          tooltip={t('export.forceExportEffectTip')}
        />
      </HStack>
    </Switch>
  );
};
