import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import CloseIcon from 'lucide-solid/icons/x';
import * as Dialog from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';

export interface MapSelectionDialogProps extends Dialog.RootProps {
  children?: JSX.Element;
}
export const MapSelectionDialog = (props: MapSelectionDialogProps) => {
  return (
    <Dialog.Root {...props}>
      <Portal>
        <Dialog.Backdrop zIndex="topDrawer" />
        <Dialog.Positioner zIndex="topDrawer">
          <Dialog.Content minWidth="2xl" height="80%">
            {props.children}
            <Dialog.CloseTrigger
              asChild={(closeTriggerProps) => (
                <IconButton
                  {...closeTriggerProps()}
                  aria-label="關閉視窗"
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
