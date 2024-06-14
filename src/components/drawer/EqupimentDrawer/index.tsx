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
} from '@/components/ui/drawer';
import { EquipSearchInput } from './EqupiSearchInput';
import { EquipList } from './EquipList';

export const EqupimentDrawer = () => {
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
    >
      <Portal>
        <Positioner>
          <Content>
            <Header>
              <Title>外觀物品</Title>
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
            <Body>
              <EquipSearchInput />
              <EquipList />
            </Body>
            <Footer />
          </Content>
        </Positioner>
      </Portal>
    </Root>
  );
};
