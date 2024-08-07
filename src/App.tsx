import { Show, onMount } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $wzReady } from '@/store/const';
import { initApp } from './store/initialize';

import { AppContainer } from './components/AppContainer';
import { BaseWzSelector } from './components/BaseWzSelector';
import { GlobalToast } from './components/GlobalToast';
import { GlobalItemContextMenu } from './components/GlobalItemContextMenu';

import { CharacterPreview } from './components/CharacterPreview';
import { ToolTabsRadioGroup } from './components/ToolTabsRadioGroup';
import { ToolTabPage } from './components/ToolTabPage';

import { EqupimentDrawer } from './components/drawer/EqupimentDrawer';
import { CurrentEquipmentDrawer } from './components/drawer/CurrentEquipmentDrawer';
import { CharacterSelectionDrawer } from './components/drawer/CharacterSelectionDrawer';
import { EquipOpenButton } from './components/drawer/EqupimentDrawer/EquipOpenButton';
import { CurrentEquipOpenButton } from './components/drawer/CurrentEquipmentDrawer/CurrentEquipOpenButton';
import { CharacterSelectionDrawerOpenButton } from './components/drawer/CharacterSelectionDrawer/CharacterSelectionDrawerOpenButton';

import { ItemContextMenuProvider } from './context/itemContextMenu';

import './store/effects';

import './App.css';

function App() {
  const ready = useStore($wzReady);

  onMount(async () => {
    await initApp();
  });

  return (
    <ItemContextMenuProvider>
      <BaseWzSelector />
      <Show when={ready()}>
        <AppContainer>
          <CharacterPreview />
          <ToolTabsRadioGroup />
          <ToolTabPage />
        </AppContainer>
        <EquipOpenButton />
        <CurrentEquipOpenButton />
        <CurrentEquipmentDrawer />
        <EqupimentDrawer />
        <CharacterSelectionDrawer />
        <CharacterSelectionDrawerOpenButton />
      </Show>
      <GlobalToast />
      <GlobalItemContextMenu />
    </ItemContextMenuProvider>
  );
}

export default App;
