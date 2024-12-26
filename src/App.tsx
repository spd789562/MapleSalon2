import { Show, onMount } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $wzReady } from '@/store/const';
import { initApp } from './store/initialize';

import { AppContainer } from './components/AppContainer';
import { GlobalToast } from './components/GlobalToast';
import { GlobalConfirmDialog } from './components/GlobalConfirmDialog';
import { GlobalItemContextMenu } from './components/GlobalItemContextMenu';

import { InitialScreen } from './components/InitialScreen';
import { ToolTabsRadioGroup } from './components/ToolTabsRadioGroup';
import { ToolTabPage } from './components/ToolTabPage';

import { EqupimentDrawer } from './components/drawer/EqupimentDrawer';
import { CurrentEquipmentDrawer } from './components/drawer/CurrentEquipmentDrawer';
import { CharacterSelectionDrawer } from './components/drawer/CharacterSelectionDrawer';
import { EquipOpenButton } from './components/drawer/EqupimentDrawer/EquipOpenButton';
import { CurrentEquipOpenButton } from './components/drawer/CurrentEquipmentDrawer/CurrentEquipOpenButton';
import { CharacterSelectionDrawerOpenButton } from './components/drawer/CharacterSelectionDrawer/CharacterSelectionDrawerOpenButton';

import { SettingDialog } from './components/dialog/SettingDialog';
import { CharacterInfoDialog } from './components/dialog/CharacterInfoDialog';
import { MapSelectionDialog } from './components/dialog/MapSelectionDialog';

import { I18nProvider } from './context/i18n';
import { ItemContextMenuProvider } from './context/itemContextMenu';

import './store/effects';

import './App.css';

function App() {
  const ready = useStore($wzReady);

  onMount(async () => {
    await initApp();
  });

  return (
    <I18nProvider>
      <ItemContextMenuProvider>
        <Show when={!ready()}>
          <InitialScreen />
        </Show>
        <Show when={ready()}>
          <AppContainer>
            <ToolTabsRadioGroup />
            <ToolTabPage />
          </AppContainer>
          <EquipOpenButton />
          <CurrentEquipOpenButton />
          <CurrentEquipmentDrawer />
          <EqupimentDrawer />
          <CharacterSelectionDrawer />
          <CharacterSelectionDrawerOpenButton />
          <SettingDialog />
          <CharacterInfoDialog />
          <MapSelectionDialog />
        </Show>
        <GlobalToast />
        <GlobalConfirmDialog />
        <GlobalItemContextMenu />
      </ItemContextMenuProvider>
    </I18nProvider>
  );
}

export default App;
