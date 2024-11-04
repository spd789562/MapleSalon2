import { createSignal, Show } from 'solid-js';

import { prepareAndFetchChairStrings } from '@/store/chair';

import { Button } from '@/components/ui/button';
import { SpinLoading } from '@/components/elements/SpinLoading';

import { nextTick } from '@/utils/eventLoop';

export const ChairDataLoadButton = () => {
  const [isLoading, setIsLoading] = createSignal(false);

  async function handleClick() {
    setIsLoading(true);
    await nextTick();
    await prepareAndFetchChairStrings();
  }

  return (
    <Button size="md" onClick={handleClick} disabled={isLoading()}>
      <Show when={isLoading()}>
        <SpinLoading size={16} />
      </Show>
      載入椅子資料
    </Button>
  );
};
