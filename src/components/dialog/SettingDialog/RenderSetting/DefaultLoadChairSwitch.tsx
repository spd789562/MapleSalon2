import { useStore } from '@nanostores/solid';

import { $defaultLoadItem, setDefaultLoadItem } from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';

export const DefaultLoadChairSwitch = () => {
  const defaultLoadItem = useStore($defaultLoadItem);

  function handleChange(details: ChangeDetails) {
    setDefaultLoadItem(details.checked);
  }

  return (
    <Switch checked={defaultLoadItem()} onCheckedChange={handleChange}>
      <HStack gap="1">
        <Text>初始化時一律載入椅子</Text>
        <SettingTooltip tooltip="於資料初始化時就載入椅子資訊，會稍微增加載入時間 **此設定開啟後無法關閉" />
      </HStack>
    </Switch>
  );
};
