import { invoke } from '@tauri-apps/api/core';

import { $apiHost } from '@/store/const';

import './App.css';
import { CharacterScene } from './components/Character';

function App() {
  async function init() {
    const url = await invoke<string>('get_server_url');
    $apiHost.set(url);
  }

  init();

  return (
    <div class="container">
      <CharacterScene />
    </div>
  );
}

export default App;
