import { createSignal } from 'solid-js';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

import { $isInitialized } from '@/store/const';

export const BaseWzSelector = () => {
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  async function selectWzFile() {
    const file = await open({
      multiple: false,
      directory: false,
      filters: [{ name: 'Base', extensions: ['wz'] }],
    });
    const path = file?.path;
    if (path) {
      setIsLoading(true);
      try {
        await invoke('init', { path });
      } catch (e) {
        if (e instanceof Error) {
          setError(JSON.stringify(e.message));
        }
        setIsLoading(false);
      }
      $isInitialized.set(true);
    }
  }

  return (
    <div>
      <button type="button" onClick={selectWzFile} disabled={isLoading()}>
        init
      </button>
      {error() && <div>{error()}</div>}
    </div>
  );
};
