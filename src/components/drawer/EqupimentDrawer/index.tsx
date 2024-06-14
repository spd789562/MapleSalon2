import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';

import { $equpimentDrawerOpen } from '@/store/trigger';

import { XIcon } from 'lucide-solid';
import { IconButton } from '@/components/ui/icon-button';
import {
  Root,
  Positioner,
  Content,
  Header,
  Title,
  Body,
  Footer,
  type RootProps,
} from '@/components/ui/drawer';

export const EqupimentDrawer = (props: RootProps) => {
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
    >
      <Portal>
        <Positioner>
          <Content>
            <Header>
              <Title>Title</Title>
              <IconButton
                variant="ghost"
                position="absolute"
                top="3"
                right="4"
                onClick={handleClose}
              >
                <XIcon />
              </IconButton>
            </Header>
            <Body>{/* Content */}</Body>
            <Footer />
          </Content>
        </Positioner>
      </Portal>
    </Root>
  );
};
