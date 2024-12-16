import { Show, createEffect } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $mapSelectionDialogOpen } from '@/store/trigger';
import {
  $isMapListUninitialized,
  $isMapSubmitDisabled,
  prepareAndFetchMapStrings,
  submitMapSelection,
} from '@/store/mapleMap';

import { Grid } from 'styled-system/jsx/grid';
import { HStack } from 'styled-system/jsx/hstack';
import { VStack } from 'styled-system/jsx/vstack';
import { Box } from 'styled-system/jsx/box';
import { Title } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UninitializedModal } from '@/components/drawer/EqupimentDrawer/UninitializedModal';
import { MapSelectionDialog as Dialog } from './MapSelectionDialog';
import { MapSearchInput } from './MapSearchInput';
import { MapList } from './MapList';
import { SelectedInfo } from './SelectedInfo';

export const MapSelectionDialog = () => {
  const isOpen = useStore($mapSelectionDialogOpen);
  const isUninitialized = useStore($isMapListUninitialized);
  const mapSubmitDisabled = useStore($isMapSubmitDisabled);

  createEffect(() => {
    if (isOpen() && isUninitialized()) {
      prepareAndFetchMapStrings();
    }
  });

  function handleClose() {
    $mapSelectionDialogOpen.set(false);
  }

  function handleSubmit() {
    submitMapSelection();
    $mapSelectionDialogOpen.set(false);
  }

  return (
    <Dialog
      open={isOpen()}
      onOpenChange={handleClose}
      unmountOnExit={true}
      lazyMount={true}
    >
      <Grid
        position="relative"
        gridTemplateRows="auto auto 1fr auto"
        height="100%"
        padding="4"
      >
        <Title>選擇地圖</Title>
        <Box width="50%">
          <MapSearchInput />
        </Box>
        <HStack height="100%" overflow="hidden" alignItems="flex-start">
          <Box position="relative" overflow="hidden" width="50%" height="100%">
            <MapList />
            <Show when={isUninitialized()}>
              <UninitializedModal />
            </Show>
          </Box>
          <VStack width="50%" height="100%">
            <SelectedInfo />
            <Button
              disabled={mapSubmitDisabled()}
              marginTop="auto"
              marginLeft="auto"
              onClick={handleSubmit}
            >
              確認
            </Button>
          </VStack>
        </HStack>
      </Grid>
    </Dialog>
  );
};
