import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import {
  $characterBrowseSearch,
  appendDefaultCharacter,
  selectCharacter,
  type SaveCharacterData,
} from '@/store/characterDrawer';
import { getHasAnyChanges } from '@/store/character/selector';
import { openDialog, DialogType } from '@/store/confirmDialog';
import { $characterBrowseDialogOpen } from '@/store/trigger';

import PlusIcon from 'lucide-solid/icons/plus';
import { Grid } from 'styled-system/jsx/grid';
import { HStack } from 'styled-system/jsx/hstack';
import { Box } from 'styled-system/jsx/box';
import { Title, type OpenChangeDetails } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadCharacterButton } from '@/components/drawer/CharacterSelectionDrawer/UploadCharacterButton';

import { CharacterBrowseDialog as Dialog } from './CharacterBrowseDialog';
import { CharacterSearchInput } from './CharacterSearchInput';
import { CharacterBrowseGrid } from './CharacterBrowseGrid';

export const CharacterBrowseDialog = () => {
  const t = useTranslate();
  const isOpen = useStore($characterBrowseDialogOpen);

  function handleClose() {
    $characterBrowseDialogOpen.set(false);
    $characterBrowseSearch.set('');
  }

  function handleOpenChange(details: OpenChangeDetails) {
    if (details.open === false) {
      handleClose();
    }
  }

  function applySelect(data: SaveCharacterData) {
    selectCharacter(data);
    handleClose();
  }

  function handleSelect(data: SaveCharacterData) {
    const hasChanges = getHasAnyChanges();
    if (hasChanges) {
      openDialog({
        type: DialogType.Confirm,
        title: t('setting.abandonCharacterChangesTitle'),
        description: t('setting.abandonCharacterChangesDesc'),
        confirmButton: {
          text: t('setting.abandonCharacterChanges'),
          onClick: () => applySelect(data),
        },
      });
    } else {
      applySelect(data);
    }
  }

  function handleAddCharacter() {
    appendDefaultCharacter();
  }

  return (
    <Dialog
      open={isOpen()}
      onOpenChange={handleOpenChange}
      unmountOnExit={true}
      lazyMount={true}
    >
      <Grid
        position="relative"
        gridTemplateRows="auto auto 1fr"
        height="[100%]"
        padding="4"
      >
        <Title>{t('common.browseCharactersTitle')}</Title>
        <HStack gap="2" alignItems="center">
          <Box flex="1" minWidth="0">
            <CharacterSearchInput />
          </Box>
          <Button
            id="button-browse-add-default-character"
            variant="outline"
            size="sm"
            onClick={handleAddCharacter}
            title={t('setting.newCharacter')}
          >
            <PlusIcon />
            {t('setting.newCharacter')}
          </Button>
          <UploadCharacterButton
            inputId="browseUploadCharacter"
            size="sm"
            variant="outline"
          />
        </HStack>
        <CharacterBrowseGrid onSelect={handleSelect} />
      </Grid>
    </Dialog>
  );
};
