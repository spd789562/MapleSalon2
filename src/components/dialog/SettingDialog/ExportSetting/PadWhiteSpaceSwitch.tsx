import { useStore } from '@nanostores/solid';

import {
  $padWhiteSpaceWhenExportFrame,
  setPadWhiteSpaceWhenExportFrame,
} from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';

export const PadWhiteSpaceSwitch = () => {
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
        <Text>匯出分鏡時填補空白</Text>
        <SettingTooltip tooltip="分鏡將會統一角色圖片大小，以利播放" />
      </HStack>
    </Switch>
  );
};
