import { useStore } from '@nanostores/solid';

import {
  $enableExperimentalUpscale,
  setEnableExperimentalUpscale,
} from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';

export const UpscaleSwitch = () => {
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
        <Text>實驗性高清預覽</Text>
        <SettingTooltip tooltip="新增按鈕顯示高清化的角色預覽，開啟時顯示高清版(Anime4K)的角色預覽，此功能可能造成一些效能影響，請確認有足夠的電腦資源再使用" />
      </HStack>
    </Switch>
  );
};
