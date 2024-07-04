import { createSignal } from 'solid-js';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

import { $isInitialized, $apiHost } from '@/store/const';
import { $equipmentStrings, type EquipItem } from '@/store/string';
import { initialGlobalRenderer } from '@/store/renderer';

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

        await fetch(`${$apiHost.get()}/string/equip/prepare`);
        const strings = await fetch(
          `${$apiHost.get()}/string/equip?cache=14400`,
        )
          .then((res) => res.json())
          .then((res: [string, string, string][]) =>
            res.map(
              ([category, id, name]) =>
                ({ category, id: Number.parseInt(id), name }) as EquipItem,
            ),
          );
        $equipmentStrings.set(strings);

        await initialGlobalRenderer();
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
