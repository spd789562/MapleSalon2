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
        <SettingTooltip tooltip="新增按鈕顯示高清化的角色預覽" />
      </HStack>
    </Switch>
  );
};
