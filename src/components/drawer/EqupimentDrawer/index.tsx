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
  CloseTrigger,
  type RootProps,
} from '@/components/ui/drawer';

export const Demo = (props: RootProps) => {
  const isOpen = useStore($equpimentDrawerOpen);

  return (
    <Root open={isOpen()} {...props}>
      <Positioner>
        <Content>
          <Header>
            <Title>Title</Title>
            <CloseTrigger
              asChild={() => (
                <IconButton variant="ghost">
                  <XIcon />
                </IconButton>
              )}
              position="absolute"
              top="3"
              right="4"
            />
          </Header>
          <Body>{/* Content */}</Body>
          <Footer />
        </Content>
      </Positioner>
    </Root>
  );
};
