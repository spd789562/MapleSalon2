import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { invoke } from '@tauri-apps/api/core';

import { $apiHost, $isInitialized, $wzReady } from '@/store/const';
import { $equipmentStrings, type EquipItem } from '@/store/string';

import { BaseWzSelector } from './components/BaseWzSelector';
import { CharacterScene } from './components/Character';
import { ItemNameSearch } from './components/ItemNameSearch';
import { EqupimentDrawer as Drawer } from './components/drawer/EqupimentDrawer';
import { EquipOpenButton } from './components/drawer/EqupimentDrawer/EquipOpenButton';

import './App.css';

function App() {
  const ready = useStore($wzReady);

  async function init() {
    const { url, is_initialized } = await invoke<{
      url: string;
      is_initialized: boolean;
    }>('get_server_url');

    if (is_initialized) {
      await fetch(`${url}/string/equip/prepare`);
      const strings = await fetch(`${url}/string/equip`)
        .then((res) => res.json())
        .then((res: [string, string, string][]) =>
          res.map(
            ([category, id, name]) =>
              ({ category, id: Number.parseInt(id), name }) as EquipItem,
          ),
        );
      $equipmentStrings.set(strings);
    }

    $apiHost.set(url);
    $isInitialized.set(is_initialized);

    console.info('API host:', url);
  }

  init();

  return (
    <div class="container">
      <BaseWzSelector />
      <Show when={ready()}>
        <ItemNameSearch />
        <CharacterScene />
        <EquipOpenButton />
        <Drawer />
      </Show>
    </div>
  );
}

export default App;
