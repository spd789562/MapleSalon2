import { type JSX, createContext, useContext, createSignal } from 'solid-js';
import { Portal, Show } from 'solid-js/web';
import { useStore } from '@nanostores/solid';

import { $characterInfoDialogOpen } from '@/store/trigger';
import { clearCurrentCharacterInfo } from '@/store/characterInfo';

import CloseIcon from 'lucide-solid/icons/x';
import * as Dialog from '@/components/ui/dialog';
import { IconButton } from '@/components/ui/icon-button';

import domToImage from 'dom-to-image-more';
import { nextTick } from '@/utils/eventLoop';

const ExportContentContext = createContext<(() => Promise<Blob>) | undefined>();

export interface CharacterInfoDialogProps {
  children?: JSX.Element;
}
export const CharacterInfoDialog = (props: CharacterInfoDialogProps) => {
  let contentRef!: HTMLDivElement;
  const [isExporting, setIsExporting] = createSignal(false);
  const isOpen = useStore($characterInfoDialogOpen);

  function handleClose() {
    $characterInfoDialogOpen.set(false);
  }

  function handleExitComplete() {
    clearCurrentCharacterInfo();
  }

  async function handleExport() {
    setIsExporting(true);
    await nextTick();
    try {
      const blob = await domToImage.toBlob(contentRef, {
        /* @ts-ignore */
        copyDefaultStyles: false,
      });

      setIsExporting(false);
      return blob;
    } catch (_) {
      throw new Error('Export failed');
    }
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
          <ExportContentContext.Provider value={handleExport}>
            <Dialog.Content ref={contentRef} minWidth="xl">
              {props.children}
              <Show when={!isExporting()}>
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
              </Show>
            </Dialog.Content>
          </ExportContentContext.Provider>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export function useExportContent() {
  const context = useContext(ExportContentContext);

  if (!context) {
    throw new Error(
      'useExportContent must be used within a ExportContentContext',
    );
  }

  return context;
}
