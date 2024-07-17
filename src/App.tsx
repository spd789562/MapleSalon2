import { Show, onMount } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { invoke } from '@tauri-apps/api/core';

import { $apiHost, $isInitialized, $wzReady } from '@/store/const';
import { $equipmentStrings, type EquipItem } from '@/store/string';
import { initialGlobalRenderer } from '@/store/renderer';

import { AppContainer } from './components/AppContainer';
import { BaseWzSelector } from './components/BaseWzSelector';
import { GlobalToast } from './components/GlobalToast';

import { CharacterPreview } from './components/CharacterPreview';

import { EqupimentDrawer } from './components/drawer/EqupimentDrawer';
import { CurrentEquipmentDrawer } from './components/drawer/CurrentEquipmentDrawer';
import { CharacterSelectionDrawer } from './components/drawer/CharacterSelectionDrawer';
import { EquipOpenButton } from './components/drawer/EqupimentDrawer/EquipOpenButton';
import { CurrentEquipOpenButton } from './components/drawer/CurrentEquipmentDrawer/CurrentEquipOpenButton';
import { CharacterSelectionDrawerOpenButton } from './components/drawer/CharacterSelectionDrawer/CharacterSelectionDrawerOpenButton';

import './store/effects';

import './App.css';

function App() {
  const ready = useStore($wzReady);

  async function init() {
    const { url, is_initialized } = await invoke<{
      url: string;
      is_initialized: boolean;
    }>('get_server_url');

    $apiHost.set(url);

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

      try {
        await initialGlobalRenderer();
      } catch (e) {
        console.error('initialGlobalRenderer failed', e);
      }
    }

    $isInitialized.set(is_initialized);

    console.info('API host:', url);
  }

  onMount(() => {
    init();
  });

  return (
    <>
      <BaseWzSelector />
      <Show when={ready()}>
        <AppContainer>
          <CharacterPreview />
        </AppContainer>
        <EquipOpenButton />
        <CurrentEquipOpenButton />
        <CurrentEquipmentDrawer />
        <EqupimentDrawer />
        <CharacterSelectionDrawer />
        <CharacterSelectionDrawerOpenButton />
      </Show>
      <GlobalToast />
    </>
  );
}

export default App;
