import { useStore } from '@nanostores/solid';

import { $equipmentDrawerExperimentCharacterRender } from '@/store/equipDrawer';

import InfoIcon from 'lucide-solid/icons/info';
import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SimpleTooltip } from '@/components/ui/tooltip';

export const CharacterRenderingSwitch = () => {
  const checked = useStore($equipmentDrawerExperimentCharacterRender);

  function handleChange(detail: ChangeDetails) {
    $equipmentDrawerExperimentCharacterRender.set(detail.checked);
  }

  return (
    <Switch
      id="CharacterRenderingSwitch"
      checked={checked()}
      onCheckedChange={handleChange}
    >
      <HStack gap="1">
        <Text size="sm">角色渲染</Text>
        <SimpleTooltip
          zIndex={1500}
          tooltip="將髮型/臉型直接渲染成角色，可以有較佳的預覽體驗，但可能造成大量記憶體消耗"
        >
          <InfoIcon color="currentColor" size="16" />
        </SimpleTooltip>
      </HStack>
    </Switch>
  );
};
