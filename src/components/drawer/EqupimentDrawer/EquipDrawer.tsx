import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';

import { $equpimentDrawerOpen } from '@/store/trigger';

import CloseIcon from 'lucide-solid/icons/x';
import { IconButton } from '@/components/ui/icon-button';
import {
  Root,
  Positioner,
  Content,
  Header,
  Body,
} from '@/components/ui/drawer';

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
              <IconButton
                variant="ghost"
                position="absolute"
                top="3"
                right="4"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Header>
            <Body p={2}>{props.body}</Body>
          </Content>
        </Positioner>
      </Portal>
    </Root>
  );
};
