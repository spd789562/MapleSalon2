import { useStore } from '@nanostores/solid';

import { $forceExportEffect } from '@/store/toolTab';

import { HStack } from 'styled-system/jsx/hstack';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { IconTooltop, IconType } from '@/components/elements/IconTooltip';

export const ForceExportEffectSwitch = () => {
  const isAnimating = useStore($forceExportEffect);

  function handleChange(details: ChangeDetails) {
    $forceExportEffect.set(details.checked);
  }

  return (
    <Switch checked={isAnimating()} onCheckedChange={handleChange}>
      <HStack>
        強制匯出特效
        <IconTooltop
          type={IconType.Info}
          tooltip="動畫及分鏡將會帶有特效(如披風)，但動圖將會無法無縫循環播放"
        />
      </HStack>
    </Switch>
  );
};
