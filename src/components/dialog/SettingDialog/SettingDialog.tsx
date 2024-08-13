import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';

import { $settingDialogOpen } from '@/store/trigger';

import CloseIcon from 'lucide-solid/icons/x';
import * as Dialog from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';

export interface SettingDialogProps {
  children?: JSX.Element;
}
export const SettingDialog = (props: SettingDialogProps) => {
  const isOpen = useStore($settingDialogOpen);

  function handleClose() {
    $settingDialogOpen.set(false);
  }

  function handleExitComplete() {}

  return (
    <Dialog.Root
      open={isOpen()}
      onOpenChange={handleClose}
      onExitComplete={handleExitComplete}
    >
      <Portal>
        <Dialog.Backdrop zIndex="settingOverlay" />
        <Dialog.Positioner zIndex="settingModal">
          <Dialog.Content minWidth="md">
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
