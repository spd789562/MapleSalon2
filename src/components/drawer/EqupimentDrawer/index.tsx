import { Match, Switch } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $toolTab } from '@/store/toolTab';

import { EquipEdit } from '@/components/EquipEdit';
import { EquipDrawer } from './EquipDrawer';
import { EquipPage } from './Equip/EquipPage';
import { ChairPage } from './Chair/ChairPage';
import { MiniCharacterWindow } from './MiniCharacter/MiniCharacterWindow';

import { ToolTab } from '@/const/toolTab';

export const EqupimentDrawer = () => {
  const tab = useStore($toolTab);

  return (
    <EquipDrawer
      header={
        <Switch fallback={<EquipEdit />}>
          <Match when={tab() !== ToolTab.Character && tab() !== ToolTab.Chair}>
            <MiniCharacterWindow />
          </Match>
        </Switch>
      }
      body={
        <Switch fallback={<EquipPage />}>
          <Match when={tab() === ToolTab.Chair}>
            <ChairPage />
          </Match>
        </Switch>
      }
    />
  );
};
