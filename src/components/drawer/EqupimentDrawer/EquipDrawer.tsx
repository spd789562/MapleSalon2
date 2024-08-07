import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';

import { $equpimentDrawerOpen, $equpimentDrawerPin } from '@/store/trigger';

import CloseIcon from 'lucide-solid/icons/x';
import { HStack } from 'styled-system/jsx/hstack';
import { IconButton } from '@/components/ui/icon-button';
import {
  Root,
  Positioner,
  Content,
  Header,
  Body,
} from '@/components/ui/drawer';
import { PinIconButton } from '@/components/PinIconButton';

interface EquipDrawerProps {
  header: JSX.Element;
  body: JSX.Element;
}
export const EquipDrawer = (props: EquipDrawerProps) => {
  const isOpen = useStore($equpimentDrawerOpen);

  function handleClose(_: unknown) {
    $equpimentDrawerOpen.set(false);
  }

  return (
    <Root
      open={isOpen()}
      modal={false}
      closeOnInteractOutside={false}
      trapFocus={false}
      onEscapeKeyDown={handleClose}
      lazyMount={true}
      preventScroll={false}
    >
      <Portal>
        <Positioner>
          <Content>
            <Header>
              {props.header}
              <HStack position="absolute" top="1" right="1">
                <PinIconButton store={$equpimentDrawerPin} variant="ghost" />
                <IconButton variant="ghost" onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
              </HStack>
            </Header>
            <Body p={2}>{props.body}</Body>
          </Content>
        </Positioner>
      </Portal>
    </Root>
  );
};
