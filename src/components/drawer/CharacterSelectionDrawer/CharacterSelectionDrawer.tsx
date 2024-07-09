import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';

import { $characterSelectionDrawerOpen } from '@/store/trigger';
import { Root, Positioner, Content, Body } from '@/components/ui/drawer';

interface CharacterSelectionDrawerProps {
  body: JSX.Element;
  variant: 'top';
}
export const CharacterSelectionDrawer = (
  props: CharacterSelectionDrawerProps,
) => {
  const isOpen = useStore($characterSelectionDrawerOpen);

  function handleClose(_: unknown) {
    $characterSelectionDrawerOpen.set(false);
  }

  return (
    <Root
      open={isOpen()}
      onEscapeKeyDown={handleClose}
      variant={props.variant}
      modal={false}
      closeOnInteractOutside={false}
      trapFocus={false}
      lazyMount={true}
      preventScroll={false}
    >
      <Portal>
        <Positioner
          height="9rem"
          width="xs"
          maxWidth="full"
          position="absolute"
        >
          <Content borderBottomRadius="md">
            <Body p={2}>{props.body}</Body>
          </Content>
        </Positioner>
      </Portal>
    </Root>
  );
};
