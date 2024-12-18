import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { useHoverTrigger } from '@/hook/hoverTrigger';

import CloseIcon from 'lucide-solid/icons/x';
import MousePointerClickIcon from 'lucide-solid/icons/mouse-pointer-click';
import MoveIcon from 'lucide-solid/icons/move';
import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Box } from 'styled-system/jsx/box';
import { Text } from '@/components/ui/text';
import { IconButton } from '@/components/ui/icon-button';
import * as Popover from '@/components/ui/popover';
import { OpenMapSelectionButton } from './OpenMapSelectionButton';
import { TargetPositionPad } from './TargetPositionPad';
const HOVER_DELAY = 300;

export interface CharacterSceneMapPopoverProps {
  children?: JSX.Element;
}
export const CharacterSceneMapPopover = (
  props: CharacterSceneMapPopoverProps,
) => {
  const {
    isOpen,
    onHover: handleHoverTrigger,
    resetHoverTimer: handleResetHoverTimer,
    onOutsideClick: handleOutsideClick,
  } = useHoverTrigger({ delay: HOVER_DELAY });

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
          <Popover.Content minWidth="16rem">
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            <Stack gap="2">
              <Popover.Title>地圖背景</Popover.Title>
              <OpenMapSelectionButton />
              <HStack gap="1" alignItems="center">
                <Text size="md">物體位置</Text>
                <HStack gap="1" alignItems="center" color="gray.10">
                  <MousePointerClickIcon size={14} />
                  <span>/</span>
                  <MoveIcon size={14} />
                </HStack>
              </HStack>
              <TargetPositionPad />
              <Text>快速選擇(最多5筆)</Text>
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
