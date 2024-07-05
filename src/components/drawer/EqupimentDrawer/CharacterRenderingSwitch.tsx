import { Show } from 'solid-js';

import { useStore } from '@nanostores/solid';

import {
  $equipmentDrawerExperimentCharacterRender,
  $isShowExperimentCharacterRenderSwitch,
} from '@/store/equipDrawer';

import InfoIcon from 'lucide-solid/icons/info';
import { Flex } from 'styled-system/jsx/flex';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SimpleTooltip } from '@/components/ui/tooltip';

export const CharacterRenderingSwitch = () => {
  const isShow = useStore($isShowExperimentCharacterRenderSwitch);
  const checked = useStore($equipmentDrawerExperimentCharacterRender);

  function handleChange(detail: ChangeDetails) {
    $equipmentDrawerExperimentCharacterRender.set(detail.checked);
  }

  return (
    <Show when={isShow()}>
      <Flex flexDirection="column" textAlign="left">
        <Flex alignItems="center" gap={1}>
          <Text as="label" size="sm">
            角色渲染
          </Text>
          <SimpleTooltip
            zIndex={1500}
            tooltip="將道具直接渲染成角色，可以有較佳的預覽體驗，但可能造成大量記憶體消耗"
          >
            <InfoIcon color="currentColor" size="16" />
          </SimpleTooltip>
        </Flex>
        <Switch
          id="CharacterRenderingSwitch"
          checked={checked()}
          onCheckedChange={handleChange}
          width="2.4rem"
        />
      </Flex>
    </Show>
  );
};
