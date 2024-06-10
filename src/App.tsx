import { useStore } from '@nanostores/solid';
import { invoke } from '@tauri-apps/api/core';

import { $apiHost, $isInitialized, $wzReady } from '@/store/const';

import { BaseWzSelector } from './components/BaseWzSelector';
import { CharacterScene } from './components/Character';
import { ItemNameSearch } from './components/ItemNameSearch';
import './App.css';

function App() {
  const ready = useStore($wzReady);

  async function init() {
    const { url, is_initialized } = await invoke<{
      url: string;
      is_initialized: boolean;
    }>('get_server_url');

    $apiHost.set(url);
    $isInitialized.set(is_initialized);

    console.info('API host:', url);
  }

  init();

  return (
    <div class="container">
      <BaseWzSelector />
      {ready() && (
        <>
          <ItemNameSearch />
          <CharacterScene />
        </>
      )}
    </div>
  );
}

export default App;
