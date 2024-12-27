import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useTranslate } from '@/context/i18n';

import CloseIcon from 'lucide-solid/icons/x';
import * as Dialog from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';

export interface CharacterSelectionDialogProps extends Dialog.RootProps {
  children?: JSX.Element;
}
export const CharacterSelectionDialog = (
  props: CharacterSelectionDialogProps,
) => {
  const t = useTranslate();
  return (
    <Dialog.Root {...props}>
      <Portal>
        <Dialog.Backdrop zIndex="topDrawer" />
        <Dialog.Positioner zIndex="topDrawer">
          <Dialog.Content minWidth="2xl" height="75%">
            {props.children}
            <Dialog.CloseTrigger
              asChild={(closeTriggerProps) => (
                <IconButton
                  {...closeTriggerProps()}
                  aria-label={t('common.closeDialog')}
                  title={t('common.closeDialog')}
                  variant="ghost"
                  size="sm"
                  position="absolute"
                  top="2"
                  right="2"
                >
                  <CloseIcon />
                </IconButton>
              )}
            />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};
