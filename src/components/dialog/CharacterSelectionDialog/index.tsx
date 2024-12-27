import { createSignal, splitProps } from 'solid-js';
import type { ReadableAtom } from 'nanostores';
import { useTranslate } from '@/context/i18n';

import { Grid } from 'styled-system/jsx/grid';
import { HStack } from 'styled-system/jsx';
import {
  Title,
  type RootProps as DialogRootProps,
  type OpenChangeDetails,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

import { CharacterSelectionDialog as Dialog } from './CharacterSelectionDialog';
import { CharacterGrid } from './CharacterGrid';

const DEFAULT_COLUMN_COUNT = 7;

export interface CharacterSelectionDialogProps extends DialogRootProps {
  columnCount?: number;
  currentSelection: ReadableAtom<string[]>;
  onExit?: (ids: string[]) => void;
}
export const CharacterSelectionDialog = (
  props: CharacterSelectionDialogProps,
) => {
  const t = useTranslate();
  const [selectedIds, setSelectIds] = createSignal([] as string[]);
  const [selfProps, dialogProps] = splitProps(props, [
    'columnCount',
    'currentSelection',
    'onOpenChange',
  ]);

  function handleOpenChange(detail: OpenChangeDetails) {
    if (detail.open === true) {
      setSelectIds(props.currentSelection.get());
    }
    selfProps.onOpenChange?.(detail);
  }

  function handleSelect(id: string) {
    const currentIds = selectedIds();
    const index = currentIds.indexOf(id);
    if (index !== -1) {
      currentIds.splice(index, 1);
    } else {
      currentIds.push(id);
    }
    setSelectIds([...currentIds]);
  }

  function handleClear() {
    setSelectIds([]);
  }

  function handleExit() {
    props.onExit?.(selectedIds());
  }

  return (
    <Dialog
      {...dialogProps}
      onOpenChange={handleOpenChange}
      onExitComplete={handleExit}
    >
      <Grid
        position="relative"
        gridTemplateRows="auto 1fr auto"
        height="[100%]"
        padding="4"
      >
        <Title>{t('common.selectShareCharacter')}</Title>
        <CharacterGrid
          columnCount={selfProps.columnCount ?? DEFAULT_COLUMN_COUNT}
          selectedIds={selectedIds()}
          onSelect={handleSelect}
        />
        <HStack justify="flex-end" py="1">
          <Button variant="outline" onClick={handleClear}>
            {t('common.clearSelection')}
          </Button>
        </HStack>
      </Grid>
    </Dialog>
  );
};
