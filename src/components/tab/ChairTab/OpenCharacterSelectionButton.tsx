import { useStore } from '@nanostores/solid';

import { $otherCharacterIds } from '@/store/chair';
import { $chairCharacterSelectionDialogOpen } from '@/store/trigger';

import { Button } from '@/components/ui/button';
import type { OpenChangeDetails } from '@/components/ui/dialog';
import { CharacterSelectionDialog } from '@/components/dialog/CharacterSelectionDialog';

export const OpenCharacterSelectionButton = () => {
  const isOpen = useStore($chairCharacterSelectionDialogOpen);

  function handleExit(ids: string[]) {
    $otherCharacterIds.set(ids);

    $chairCharacterSelectionDialogOpen.set(false);
  }
  function handleOpenChange(details: OpenChangeDetails) {
    if (details.open === false) {
      $chairCharacterSelectionDialogOpen.set(false);
    }
  }
  function handleOpen() {
    $chairCharacterSelectionDialogOpen.set(true);
  }

  return (
    <>
      <Button variant="outline" onClick={handleOpen}>
        選擇共乘角色
      </Button>
      <CharacterSelectionDialog
        open={isOpen()}
        onOpenChange={handleOpenChange}
        onExit={handleExit}
        currentSelection={$otherCharacterIds}
      />
    </>
  );
};
