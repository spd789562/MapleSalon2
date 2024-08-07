import { createSignal, Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { open } from '@tauri-apps/plugin-dialog';

import { initByWzBase } from '@/store/initialize';

import LoaderCircle from 'lucide-solid/icons/loader-circle';
import { Button } from '@/components/ui/button';

export const SelectWzButton = () => {
  const [isLoading, setIsLoading] = createSignal(false);

  async function handleClick() {
    const file = await open({
      multiple: false,
      directory: false,
      filters: [{ name: 'Base', extensions: ['wz'] }],
    });
    const path = file?.path;
    if (path) {
      setIsLoading(true);
      try {
        await initByWzBase(path);
      } finally {
        setIsLoading(false);
      }
    }
  }

  return (
    <Button onClick={handleClick} disabled={isLoading()}>
      <Show when={isLoading()}>
        <Loading>
          <LoaderCircle />
        </Loading>
      </Show>
      載入新 Base.wz 檔
    </Button>
  );
};

const Loading = styled('div', {
  base: {
    animation: 'rotate infinite 1s linear',
    color: 'fg.muted',
  },
});
