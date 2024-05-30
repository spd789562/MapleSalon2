import { useStore } from '@nanostores/solid';
import { invoke } from '@tauri-apps/api/core';

import { $apiHost, $wzReady } from '@/store/const';

import { BaseWzSelector } from './components/BaseWzSelector';
import { CharacterScene } from './components/Character';
import './App.css';

function App() {
  const ready = useStore($wzReady);

  async function init() {
    const url = await invoke<string>('get_server_url');
    $apiHost.set(url);
    console.info('API host:', url);
  }

  init();

  return (
    <div class="container">
      <BaseWzSelector />
      {ready() && <CharacterScene />}
    </div>
  );
}

export default App;
