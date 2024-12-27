import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $mapSelectionDialogOpen } from '@/store/trigger';
import { $currentMap } from '@/store/mapleMap';
import { Button } from '@/components/ui/button';

export const OpenMapSelectionButton = () => {
  const t = useTranslate();
  const currentMap = useStore($currentMap);

  function handleOpen() {
    $mapSelectionDialogOpen.set(true);
  }

  return (
    <>
      <Button variant="outline" onClick={handleOpen}>
        {t('scene.mapDialogTitle')}
      </Button>
      <Show when={currentMap()}>{(info) => <div>{info().name}</div>}</Show>
    </>
  );
};
