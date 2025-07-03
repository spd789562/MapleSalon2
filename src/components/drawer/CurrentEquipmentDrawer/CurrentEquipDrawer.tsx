import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';

import {
  $currentEquipmentDrawerOpen,
  $currentEquipmentDrawerPin,
} from '@/store/trigger';

import { useMediaQuery } from '@/hook/mediaQuery';

import CloseIcon from 'lucide-solid/icons/x';
import { Box } from 'styled-system/jsx/box';
import { HStack } from 'styled-system/jsx/hstack';
import { IconButton } from '@/components/ui/icon-button';
import {
  Root,
  Positioner,
  Content,
  Header,
  Body,
  Footer,
} from '@/components/ui/drawer';
import { PinIconButton } from '@/components/elements/PinIconButton';

interface EquipDrawerProps {
  header?: JSX.Element;
  children?: JSX.Element;
  footer?: JSX.Element;
  bodyBg?: 'subtle' | 'light';
  variant?: 'left' | 'right';
}
export const CurrentEquipDrawer = (props: EquipDrawerProps) => {
  const isOpen = useStore($currentEquipmentDrawerOpen);
  const isPinned = useStore($currentEquipmentDrawerPin);
  const isMatch = useMediaQuery('(min-width: 64rem)');

  function handleClose(_: unknown) {
    if (isPinned()) {
      return;
    }
    $currentEquipmentDrawerOpen.set(false);
  }

  return (
    <Root
      open={isOpen()}
      onEscapeKeyDown={handleClose}
      closeOnEscape={!isPinned()}
      variant={/* @once */ props.variant}
      modal={false}
      closeOnInteractOutside={false}
      trapFocus={false}
      lazyMount={true}
      preventScroll={false}
    >
      <Portal>
        <Positioner height="unset" width="xs" maxWidth="full" top="4">
          <Content
            id="current-equipment-drawer-content"
            maxHeight="[90vh]"
            borderTopRightRadius="md"
            borderBottomRightRadius="md"
          >
            <Header>
              {props.header}
              <HStack position="absolute" top="1" right="1">
                <Box visibility={{ base: 'hidden', lg: 'visible' }}>
                  <PinIconButton
                    store={$currentEquipmentDrawerPin}
                    size="xs"
                    variant="ghost"
                  />
                </Box>
                <IconButton
                  size="xs"
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isPinned() && isMatch()}
                >
                  <CloseIcon />
                </IconButton>
              </HStack>
            </Header>
            <Body
              p={2}
              backgroundColor={
                props.bodyBg === 'subtle' ? 'bg.subtle' : 'bg.default'
              }
            >
              {props.children}
            </Body>
            <Footer>{props.footer}</Footer>
          </Content>
        </Positioner>
      </Portal>
    </Root>
  );
};
