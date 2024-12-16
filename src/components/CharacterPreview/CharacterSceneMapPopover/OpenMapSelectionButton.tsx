import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $mapSelectionDialogOpen } from '@/store/trigger';
import { $currentMap } from '@/store/mapleMap';
import { Button } from '@/components/ui/button';

export const OpenMapSelectionButton = () => {
  const currentMap = useStore($currentMap);

  function handleOpen() {
    $mapSelectionDialogOpen.set(true);
  }

  return (
    <>
      <Button variant="outline" onClick={handleOpen}>
        選擇地圖
      </Button>
      <Show when={currentMap()}>{(info) => <div>{info().name}</div>}</Show>
    </>
  );
};
