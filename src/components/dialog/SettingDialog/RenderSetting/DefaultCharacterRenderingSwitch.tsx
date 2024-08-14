import { useStore } from '@nanostores/solid';

import {
  $defaultCharacterRendering,
  setDefaultCharacterRendering,
} from '@/store/settingDialog';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SettingTooltip } from '@/components/dialog/SettingDialog/SettingTooltip';

export const DefaultCharacterRenderingSwitch = () => {
  const defaultCharacterRendering = useStore($defaultCharacterRendering);

  function handleChange(details: ChangeDetails) {
    setDefaultCharacterRendering(details.checked);
  }

  return (
    <Switch
      checked={defaultCharacterRendering()}
      onCheckedChange={handleChange}
    >
      <HStack gap="1">
        <Text>預設角色渲染</Text>
        <SettingTooltip tooltip="於髮型及臉型列表時，將預設把道具直接渲染成角色，可以有較佳的預覽體驗，但可能造成大量記憶體消耗" />
      </HStack>
    </Switch>
  );
};
