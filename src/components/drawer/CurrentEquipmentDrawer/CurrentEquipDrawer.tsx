import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';

import { $currentEquipmentDrawerOpen } from '@/store/trigger';

import CloseIcon from 'lucide-solid/icons/x';
import { IconButton } from '@/components/ui/icon-button';
import {
  Root,
  Positioner,
  Content,
  Header,
  Body,
  Footer,
} from '@/components/ui/drawer';

interface EquipDrawerProps {
  header?: JSX.Element;
  body: JSX.Element;
  footer?: JSX.Element;
  variant?: 'left' | 'right';
}
export const CurrentEquipDrawer = (props: EquipDrawerProps) => {
  const isOpen = useStore($currentEquipmentDrawerOpen);

  function handleClose(_: unknown) {
    $currentEquipmentDrawerOpen.set(false);
  }

  return (
    <Root
      open={isOpen()}
      onEscapeKeyDown={handleClose}
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
            maxHeight="[90vh]"
            borderTopRightRadius="md"
            borderBottomRightRadius="md"
          >
            <Header>
              {props.header}
              <IconButton
                variant="ghost"
                position="absolute"
                top="1"
                right="1"
                size="xs"
                onClick={handleClose}
              >
                <CloseIcon />
              </IconButton>
            </Header>
            <Body p={2} backgroundColor="bg.subtle">
              {props.body}
            </Body>
            <Footer>{props.footer}</Footer>
          </Content>
        </Positioner>
      </Portal>
    </Root>
  );
};
