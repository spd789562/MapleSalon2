import { type JSX, createSignal } from 'solid-js';
import { useTranslate } from '@/context/i18n';

import { $mapTags, $mapBackgroundTags } from '@/store/mapleMap';

import MousePointerClickIcon from 'lucide-solid/icons/mouse-pointer-click';
import MoveIcon from 'lucide-solid/icons/move';
import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { CssTooltip } from '@/components/ui/cssTooltip';
import { IconCssTooltip, IconType } from '@/components/elements/IconTooltip';
import { CharacterSceneMapPopover as ScenePopover } from './CharacterSceneMapPopover';
import { OpenMapSelectionButton } from './OpenMapSelectionButton';
import { TargetPositionPad } from './TargetPositionPad';
import { TargetLayerNumberInput } from './TargetLayerNumberInput';
import { TargetOffsetNumberInputs } from './TargetOffsetNumberInputs';
import { MapLayerToggleTag } from './MapLayerToggleTag';
import { MapToggleTag } from './MapToggleTag';
import { MapSelectionHistory } from './MapSelectionHistory';

export interface CharacterSceneMapPopoverProps {
  children?: JSX.Element;
}
export const CharacterSceneMapPopover = (
  props: CharacterSceneMapPopoverProps,
) => {
  const t = useTranslate();
  const [isUsingPad, setIsUsingPad] = createSignal(false);

  return (
    <ScenePopover trigger={props.children} isNeedTransparency={isUsingPad()}>
      <HStack gap="2" alignItems="flex-start">
        <Stack width="50%">
          <Heading size="md" as="h3">
            {t('scene.mapBackgroundTitle')}
          </Heading>
          <OpenMapSelectionButton />
          <TargetPositionTitle />
          <TargetPositionPad
            onStartMove={() => setIsUsingPad(true)}
            onEndMove={() => setIsUsingPad(false)}
          />
          <TargetOffsetNumberInputs />
          <TargetLayerNumberInput />
        </Stack>
        <Stack width="50%">
          <Heading size="md" as="h4">
            {t('scene.mapShowLayer')}
          </Heading>
          <MapLayerToggleTag />
          <HStack gap="1" alignItems="center">
            <Heading size="md" as="h4">
              {t('scene.mapTag')}
            </Heading>
            <IconCssTooltip
              tooltip={t('scene.mapTagTip')}
              type={IconType.Question}
            />
          </HStack>
          <MapToggleTag target={$mapBackgroundTags} />
          <Heading size="md" as="h4">
            {t('scene.mapObjTag')}
          </Heading>
          <MapToggleTag target={$mapTags} />
          <Heading size="md" as="h4">
            {t('scene.mapQuickSelect')}
          </Heading>
          <MapSelectionHistory />
        </Stack>
      </HStack>
    </ScenePopover>
  );
};

const TargetPositionTitle = () => (
  <HStack gap="1" alignItems="center">
    <Heading size="md" as="h4">
      物體位置
    </Heading>
    <CssTooltip data-tooltip-content="於範圍內拖曳，或點擊拖曳點使用方向鍵移動">
      <HStack gap="1" alignItems="center" color="gray.10">
        <MousePointerClickIcon size={14} />
        <span>/</span>
        <MoveIcon size={14} />
      </HStack>
    </CssTooltip>
  </HStack>
);
