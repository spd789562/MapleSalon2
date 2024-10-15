import { useStore } from '@nanostores/solid';

import {
  $addBlackBgWhenExportGif,
  setAddBlackBgWhenExportGif,
} from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';

export const AddBlackBgToGifSwitch = () => {
  const addBlackBgWhenExportGif = useStore($addBlackBgWhenExportGif);

  function handleChange(details: ChangeDetails) {
    setAddBlackBgWhenExportGif(details.checked);
  }

  return (
    <Switch checked={addBlackBgWhenExportGif()} onCheckedChange={handleChange}>
      <HStack gap="1">
        <Text>匯出 Gif 時自動填補黑色</Text>
        <SettingTooltip tooltip="此設定將會使匯出的 Gif 有黑色背景，改善部分裝備為半透明時會導致匯出時黑時白的問題" />
      </HStack>
    </Switch>
  );
};
