import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import {
  $characterBrowseSearch,
  selectCharacter,
  type SaveCharacterData,
} from '@/store/characterDrawer';
import { getHasAnyChanges } from '@/store/character/selector';
import { openDialog, DialogType } from '@/store/confirmDialog';
import { $characterBrowseDialogOpen } from '@/store/trigger';

import { Grid } from 'styled-system/jsx/grid';
import { Box } from 'styled-system/jsx/box';
import { Title, type OpenChangeDetails } from '@/components/ui/dialog';

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
        <Box width={{ base: 'full', md: '50%' }}>
          <CharacterSearchInput />
        </Box>
        <CharacterBrowseGrid onSelect={handleSelect} />
      </Grid>
    </Dialog>
  );
};
