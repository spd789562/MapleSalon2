import type { JSX } from 'solid-js';
import MousePointerClickIcon from 'lucide-solid/icons/mouse-pointer-click';
import MoveIcon from 'lucide-solid/icons/move';
import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import * as Popover from '@/components/ui/popover';
import { CharacterSceneMapPopover as ScenePopover } from './CharacterSceneMapPopover';
import { OpenMapSelectionButton } from './OpenMapSelectionButton';
import { TargetPositionPad } from './TargetPositionPad';
import { TargetLayerNumberInput } from './TargetLayerNumberInput';

export interface CharacterSceneMapPopoverProps {
  children?: JSX.Element;
}
export const CharacterSceneMapPopover = (
  props: CharacterSceneMapPopoverProps,
) => {
  return (
    <ScenePopover trigger={props.children}>
      <Stack gap="2">
        <Popover.Title>地圖背景</Popover.Title>
        <OpenMapSelectionButton />
        <TargetPositionTitle />
        <TargetPositionPad />
        <TargetLayerNumberInput />
        <Text>快速選擇(最多5筆)</Text>
      </Stack>
    </ScenePopover>
  );
};

const TargetPositionTitle = () => (
  <HStack gap="1" alignItems="center">
    <Text size="md">物體位置</Text>
    <HStack gap="1" alignItems="center" color="gray.10">
      <MousePointerClickIcon size={14} />
      <span>/</span>
      <MoveIcon size={14} />
    </HStack>
  </HStack>
);
