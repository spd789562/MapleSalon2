import { type JSX, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';

import { $sceneOffsetX, $sceneOffsetY } from '@/store/scene';

import { XIcon } from 'lucide-solid';
import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Box } from 'styled-system/jsx/box';
import { Text } from '@/components/ui/text';
import { IconButton } from '@/components/ui/icon-button';
import * as Popover from '@/components/ui/popover';
import { UploadBackgroundButton } from './UploadBackgroundButton';
import { SceneOffsetNumberInput } from './SceneOffsetNumberInput';
import { SceneOffsetResetButton } from './SceneOffsetResetButton';
import { UploadHistory } from './UploadHistory';

const HOVER_DELAY = 300;

export interface CharacterSceneBackgroundPopoverProps {
  children?: JSX.Element;
}
export const CharacterSceneBackgroundPopover = (
  props: CharacterSceneBackgroundPopoverProps,
) => {
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
        placement: 'top-end',
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
              <Popover.Title>自訂背景</Popover.Title>
              {/* <Popover.Description>
              </Popover.Description> */}
              <UploadBackgroundButton />
              <HStack gap="1">
                <Text>X 位移</Text>
                <SceneOffsetNumberInput target={$sceneOffsetX} />
                <SceneOffsetResetButton title="X 位移" target={$sceneOffsetX} />
              </HStack>
              <HStack gap="1">
                <Text>Y 位移</Text>
                <SceneOffsetNumberInput target={$sceneOffsetY} />
                <SceneOffsetResetButton title="Y 位移" target={$sceneOffsetY} />
              </HStack>
              <Text>上傳紀錄</Text>
              <UploadHistory />
            </Stack>
            <Box position="absolute" top="1" right="1">
              <Popover.CloseTrigger
                asChild={(closeProps) => (
                  <IconButton
                    aria-label="Close Scene Select"
                    variant="ghost"
                    size="sm"
                    {...closeProps()}
                    onClick={handleOutsideClick}
                  >
                    <XIcon />
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
