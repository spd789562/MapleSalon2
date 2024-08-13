import { createSignal } from 'solid-js';
import { Portal, Show } from 'solid-js/web';
import { styled } from 'styled-system/jsx/factory';

import { usePureStore } from '@/store';
import {
  $confirmDialogData,
  $confirmDialogOpen,
  resetDialogData,
  DialogType,
  type ButtonConfig,
  type ConfirmDialogData,
} from '@/store/confirmDialog';

import CloseIcon from 'lucide-solid/icons/x';
import LoaderCircle from 'lucide-solid/icons/loader-circle';
import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import * as Dialog from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';
import { Button } from '@/components/ui/button';

export const GlobalConfirmDialog = () => {
  const [isLoading, setIsLoading] = createSignal(false);
  const [loadTarget, setLoadTarget] = createSignal<'confirm' | 'cancel' | null>(
    null,
  );
  const isDialogOpen = usePureStore($confirmDialogOpen);
  const dialogData = usePureStore($confirmDialogData);

  function handleClose() {
    $confirmDialogOpen.set(false);
  }
  function handleExitComplete() {
    resetDialogData();
  }
  async function commonClickHandler(buttonConfig?: ButtonConfig) {
    if (!buttonConfig) {
      handleClose();
      return;
    }
    if (buttonConfig.isAsyncClick) {
      setLoadTarget(
        dialogData()?.type === DialogType.Confirm ? 'confirm' : 'cancel',
      );
      setIsLoading(true);
      await buttonConfig.onClick?.();
      setIsLoading(false);
    } else {
      buttonConfig.onClick?.();
    }
    handleClose();
  }
  function handleConfirm() {
    commonClickHandler(dialogData()?.confirmButton);
  }
  function handleCancel() {
    const data = dialogData();
    if (data?.type === DialogType.Confirm) {
      commonClickHandler(data.cancelButton);
    }
  }

  const isCancelLoading = () => isLoading() && loadTarget() === 'cancel';
  const isConfirmLoading = () => isLoading() && loadTarget() === 'confirm';

  return (
    <Dialog.Root
      open={isDialogOpen()}
      onOpenChange={handleClose}
      onExitComplete={handleExitComplete}
      closeOnEscape={dialogData()?.closable}
      closeOnInteractOutside={dialogData()?.closable}
    >
      <Portal>
        <Dialog.Backdrop zIndex="confirmOverlay" />
        <Dialog.Positioner zIndex="confirmModal">
          <Dialog.Content>
            <Show when={dialogData()}>
              {(data) => (
                <Stack gap="8" p="6">
                  <Show when={data().closable}>
                    <DialogCloseButton />
                  </Show>
                  <Stack gap="1">
                    <Dialog.Title>{data().title}</Dialog.Title>
                    <Dialog.Description>
                      {data().description}
                    </Dialog.Description>
                  </Stack>
                  <HStack
                    gap="3"
                    width="full"
                    justify={data().type === DialogType.Alert ? 'flex-end' : ''}
                  >
                    <Show when={data().type === DialogType.Confirm}>
                      <Button
                        onClick={handleCancel}
                        disabled={isLoading()}
                        variant={
                          (data() as ConfirmDialogData).cancelButton?.variant ??
                          'outline'
                        }
                        width="full"
                      >
                        <Show when={isCancelLoading()}>
                          <Loading>
                            <LoaderCircle />
                          </Loading>
                        </Show>
                        {(data() as ConfirmDialogData).cancelButton?.text ??
                          '取消'}
                      </Button>
                    </Show>
                    <Button
                      onClick={handleConfirm}
                      disabled={isLoading()}
                      variant={data().confirmButton?.variant ?? 'solid'}
                      width={
                        data().type === DialogType.Confirm ? 'full' : '50%'
                      }
                    >
                      <Show when={isConfirmLoading()}>
                        <Loading>
                          <LoaderCircle />
                        </Loading>
                      </Show>
                      {data().confirmButton?.text ?? '確認'}
                    </Button>
                  </HStack>
                </Stack>
              )}
            </Show>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

const Loading = styled('div', {
  base: {
    animation: 'rotate infinite 1s linear',
    color: 'fg.muted',
  },
});

const DialogCloseButton = () => {
  return (
    <Dialog.CloseTrigger
      asChild={(closeTriggerProps) => (
        <IconButton
          {...closeTriggerProps()}
          aria-label="關閉確認視窗"
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
  );
};
