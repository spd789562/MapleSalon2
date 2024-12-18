import type { JSX } from 'solid-js';

import { $mapTags, $mapBackgroundTags } from '@/store/mapleMap';

import MousePointerClickIcon from 'lucide-solid/icons/mouse-pointer-click';
import MoveIcon from 'lucide-solid/icons/move';
import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import * as Popover from '@/components/ui/popover';
import { IconCssTooltip, IconType } from '@/components/elements/IconTooltip';
import { CharacterSceneMapPopover as ScenePopover } from './CharacterSceneMapPopover';
import { OpenMapSelectionButton } from './OpenMapSelectionButton';
import { TargetPositionPad } from './TargetPositionPad';
import { TargetLayerNumberInput } from './TargetLayerNumberInput';
import { MapToggleTag } from './MapToggleTag';
import { MapSelectionHistory } from './MapSelectionHistory';

export interface CharacterSceneMapPopoverProps {
  children?: JSX.Element;
}
export const CharacterSceneMapPopover = (
  props: CharacterSceneMapPopoverProps,
) => {
  return (
    <ScenePopover trigger={props.children}>
      <Stack gap="2">
        <Heading size="md" as="h3">
          地圖背景
        </Heading>
        <OpenMapSelectionButton />
        <TargetPositionTitle />
        <TargetPositionPad />
        <TargetLayerNumberInput />
        <HStack gap="1" alignItems="center">
          <Heading size="md" as="h4">
            背景、前景標籤
          </Heading>
          <IconCssTooltip
            tooltip="開關部分標籤，控制部分須依情況顯示的背景前景或景物 ex：教學箭頭"
            type={IconType.Question}
          />
        </HStack>
        <MapToggleTag target={$mapBackgroundTags} />
        <Heading size="md" as="h4">
          景物標籤
        </Heading>
        <MapToggleTag target={$mapTags} />
        <Heading size="md" as="h4">
          快速選擇(最多5筆)
        </Heading>
        <MapSelectionHistory />
      </Stack>
    </ScenePopover>
  );
};

const TargetPositionTitle = () => (
  <HStack gap="1" alignItems="center">
    <Heading size="md" as="h4">
      物體位置
    </Heading>
    <HStack gap="1" alignItems="center" color="gray.10">
      <MousePointerClickIcon size={14} />
      <span>/</span>
      <MoveIcon size={14} />
    </HStack>
  </HStack>
);
