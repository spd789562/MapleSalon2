import { type JSX, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useTranslate } from '@/context/i18n';

import {
  $sceneOffsetX,
  $sceneOffsetY,
  $sceneRepeatX,
  $sceneRepeatY,
} from '@/store/scene';

import CloseIcon from 'lucide-solid/icons/x';
import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Box } from 'styled-system/jsx/box';
import { Text } from '@/components/ui/text';
import { IconButton } from '@/components/ui/icon-button';
import * as Popover from '@/components/ui/popover';
import { UploadBackgroundButton } from './UploadBackgroundButton';
import { SceneOffsetNumberInput } from './SceneOffsetNumberInput';
import { SceneOffsetResetButton } from './SceneOffsetResetButton';
import { SceneRepeatSwitch } from './SceneRepeatSwitch';
import { UploadHistory } from './UploadHistory';

const HOVER_DELAY = 300;

export interface CharacterSceneBackgroundPopoverProps {
  children?: JSX.Element;
}
export const CharacterSceneBackgroundPopover = (
  props: CharacterSceneBackgroundPopoverProps,
) => {
  const t = useTranslate();
  let hoverTimer: number | null = null;
  const [isOpen, setIsOpen] = createSignal(false);
  const handleHoverTrigger = () => {
    if (isOpen()) {
      return;
    }
    hoverTimer && clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      setIsOpen(true);
    }, HOVER_DELAY);
  };
  const handleResetHoverTimer = () => {
    hoverTimer && clearTimeout(hoverTimer);
  };
  const handleOutsideClick = () => {
    setIsOpen(false);
  };

  return (
    <Popover.Root
      open={isOpen()}
      positioning={{
        strategy: 'fixed',
        placement: 'top',
      }}
      onInteractOutside={handleOutsideClick}
    >
      <Popover.Trigger
        onMouseOver={handleHoverTrigger}
        onMouseOut={handleResetHoverTimer}
      >
        {props.children}
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <Stack gap="2">
              <Popover.Title>{t('scene.customTitle')}</Popover.Title>
              <UploadBackgroundButton />
              <HStack gap="2">
                <Text>{t('scene.xOffset')}</Text>
                <SceneOffsetNumberInput target={$sceneOffsetX} />
                <SceneOffsetResetButton
                  title={t('scene.resetxOffset')}
                  target={$sceneOffsetX}
                />
              </HStack>
              <HStack gap="2">
                <Text>{t('scene.yOffset')}</Text>
                <SceneOffsetNumberInput target={$sceneOffsetY} />
                <SceneOffsetResetButton
                  title={t('scene.resetyOffset')}
                  target={$sceneOffsetY}
                />
              </HStack>
              <HStack gap="2">
                <SceneRepeatSwitch
                  title={t('scene.repeatX')}
                  target={$sceneRepeatX}
                />
                <SceneRepeatSwitch
                  title={t('scene.repeatY')}
                  target={$sceneRepeatY}
                />
              </HStack>
              <Text>{t('scene.customUploadHistory')}</Text>
              <UploadHistory />
            </Stack>
            <Box position="absolute" top="1" right="1">
              <Popover.CloseTrigger
                asChild={(closeProps) => (
                  <IconButton
                    aria-label={t('scene.closeCustom')}
                    title={t('scene.closeCustom')}
                    variant="ghost"
                    size="sm"
                    {...closeProps()}
                    onClick={handleOutsideClick}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
              />
            </Box>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};
