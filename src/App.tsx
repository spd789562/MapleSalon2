import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { invoke } from '@tauri-apps/api/core';

import { $apiHost, $isInitialized, $wzReady } from '@/store/const';
import { $equipmentStrings, type EquipItem } from '@/store/string';

import { BaseWzSelector } from './components/BaseWzSelector';
import { CharacterScene } from './components/Character';
import { EqupimentDrawer } from './components/drawer/EqupimentDrawer';
import { CurrentEquipmentDrawer } from './components/drawer/CurrentEquipmentDrawer';
import { EquipOpenButton } from './components/drawer/EqupimentDrawer/EquipOpenButton';
import { CurrentEquipOpenButton } from './components/drawer/CurrentEquipmentDrawer/CurrentEquipOpenButton';

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
      const strings = await fetch(`${url}/string/equip?cache=14400`)
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
        <CharacterScene />
        <EquipOpenButton />
        <CurrentEquipOpenButton />
        <CurrentEquipmentDrawer />
        <EqupimentDrawer />
      </Show>
    </div>
  );
}

export default App;
