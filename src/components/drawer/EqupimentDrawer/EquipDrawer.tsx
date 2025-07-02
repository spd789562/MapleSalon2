import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $equpimentDrawerOpen, $equpimentDrawerPin } from '@/store/trigger';

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
} from '@/components/ui/drawer';
import { PinIconButton } from '@/components/elements/PinIconButton';

interface EquipDrawerProps {
  header: JSX.Element;
  body: JSX.Element;
}
export const EquipDrawer = (props: EquipDrawerProps) => {
  const t = useTranslate();
  const isOpen = useStore($equpimentDrawerOpen);
  const isPinned = useStore($equpimentDrawerPin);
  const isMatch = useMediaQuery('(min-width: 64rem)');

  function handleClose(_: unknown) {
    if (isPinned()) {
      return;
    }
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
          <Content id="equipment-drawer-content">
            <Header>
              {props.header}
              <HStack position="absolute" top="1" right="1">
                <Box visibility={{ base: 'hidden', lg: 'visible' }}>
                  <PinIconButton store={$equpimentDrawerPin} variant="ghost" />
                </Box>
                <IconButton
                  aria-label={t('common.close')}
                  title={t('common.close')}
                  variant="ghost"
                  onClick={handleClose}
                  disabled={isPinned() && isMatch()}
                >
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
