import { createSignal, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { open } from '@tauri-apps/plugin-dialog';

import { $isWzLoading, initByWzBase } from '@/store/initialize';

import LoaderCircle from 'lucide-solid/icons/loader-circle';
import { Button } from '@/components/ui/button';

export const SelectWzButton = () => {
  const isGlobalWzLoading = useStore($isWzLoading);
  const [isLoading, setIsLoading] = createSignal(false);

  async function handleClick() {
    const file = await open({
      multiple: false,
      directory: false,
      filters: [{ name: 'Base', extensions: ['wz'] }],
    });
    const path =
      typeof file === 'string' ? file : (file as null | { path: string })?.path;
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
    <Button
      size="sm"
      onClick={handleClick}
      disabled={isLoading() || isGlobalWzLoading()}
    >
      <Show when={isLoading()}>
        <Loading>
          <LoaderCircle />
        </Loading>
      </Show>
      載入新 Base.wz
    </Button>
  );
};

const Loading = styled('div', {
  base: {
    animation: 'rotate infinite 1s linear',
    color: 'fg.muted',
  },
});
