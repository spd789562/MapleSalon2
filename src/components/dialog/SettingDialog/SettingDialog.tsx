import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $settingDialogOpen } from '@/store/trigger';
import { saveSetting } from '@/store/settingDialog';

import CloseIcon from 'lucide-solid/icons/x';
import * as Dialog from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';

export interface SettingDialogProps {
  children?: JSX.Element;
}
export const SettingDialog = (props: SettingDialogProps) => {
  const t = useTranslate();
  const isOpen = useStore($settingDialogOpen);

  function handleClose() {
    $settingDialogOpen.set(false);
  }

  function handleExitComplete() {
    saveSetting();
  }

  return (
    <Dialog.Root
      open={isOpen()}
      onOpenChange={handleClose}
      onExitComplete={handleExitComplete}
      unmountOnExit={true}
    >
      <Portal>
        <Dialog.Backdrop zIndex="settingOverlay" />
        <Dialog.Positioner zIndex="settingModal">
          <Dialog.Content minWidth="xl">
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
