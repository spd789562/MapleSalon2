import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';

import { useHoverTrigger } from '@/hook/hoverTrigger';

import CloseIcon from 'lucide-solid/icons/x';
import { Box } from 'styled-system/jsx/box';
import { IconButton } from '@/components/ui/icon-button';
import * as Popover from '@/components/ui/popover';
const HOVER_DELAY = 300;

export interface CharacterSceneMapPopoverProps {
  trigger?: JSX.Element;
  isNeedTransparency?: boolean;
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
        placement: 'top',
      }}
      onInteractOutside={handleOutsideClick}
    >
      <Popover.Trigger
        onMouseOver={handleHoverTrigger}
        onMouseOut={handleResetHoverTimer}
      >
        {props.trigger}
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content
            width="32rem"
            maxWidth="32rem"
            opacity={props.isNeedTransparency ? 0.7 : undefined}
          >
            <Popover.Arrow>
              <Popover.ArrowTip />
            </Popover.Arrow>
            {props.children}
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
