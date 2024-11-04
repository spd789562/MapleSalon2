import { useStore } from '@nanostores/solid';

import { $equipmentDrawerOnlyShowDyeable } from '@/store/equipDrawer';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const OnlyShowDyeableSwitch = () => {
  const checked = useStore($equipmentDrawerOnlyShowDyeable);

  function handleChange(detail: ChangeDetails) {
    $equipmentDrawerOnlyShowDyeable.set(detail.checked);
  }

  return (
    <HStack>
      <Switch
        id="OnlyShowDyeable"
        size="sm"
        checked={checked()}
        onCheckedChange={handleChange}
      />
      <Text as="label" for="switch:OnlyShowDyeable:input" size="md">
        僅顯示可染色道具
      </Text>
    </HStack>
  );
};
