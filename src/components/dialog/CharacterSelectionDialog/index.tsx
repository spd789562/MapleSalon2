import { createSignal, splitProps, createEffect, on } from 'solid-js';
import type { ReadableAtom } from 'nanostores';

import { Grid } from 'styled-system/jsx/grid';
import {
  Title,
  type RootProps as DialogRootProps,
  type OpenChangeDetails,
} from '@/components/ui/dialog';

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
        overflow="auto"
        gridTemplateRows="auto 1fr"
        height="[100%]"
        padding="4"
      >
        <Title>選擇共乘角色</Title>
        <CharacterGrid
          columnCount={selfProps.columnCount ?? DEFAULT_COLUMN_COUNT}
          selectedIds={selectedIds()}
          onSelect={handleSelect}
        />
      </Grid>
    </Dialog>
  );
};
