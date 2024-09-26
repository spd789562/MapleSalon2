import { Switch, Match, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import {
  $currentEquipDrawerTab,
  CurrentEquipDrawerTab,
} from '@/store/currentEquipDrawer';
import { $toolTab } from '@/store/toolTab';

import { HStack } from 'styled-system/jsx/hstack';
import { CurrentEquipDrawer } from './CurrentEquipDrawer';
import { CurrentEquipDrawerTabs } from './CurrentEquipDrawerTabs';
import { CurrentEquipList } from './CurrentEquipList';
import { CharacterSetting } from './CharacterSetting';

import { ToolTab } from '@/const/toolTab';

export const CurrentEquipmentDrawer = () => {
  const tab = useStore($currentEquipDrawerTab);
  const toolTab = useStore($toolTab);

  return (
    <CurrentEquipDrawer
      bodyBg={tab() === CurrentEquipDrawerTab.Setting ? 'light' : 'subtle'}
      header={
        <Show when={toolTab() !== ToolTab.Character}>
          <HStack mt="-4" mb="-3" mx="-2">
            <CurrentEquipDrawerTabs />
          </HStack>
        </Show>
      }
      variant="left"
    >
      <Switch>
        <Match when={tab() === CurrentEquipDrawerTab.Equip}>
          <CurrentEquipList />
        </Match>
        <Match when={tab() === CurrentEquipDrawerTab.Setting}>
          <CharacterSetting />
        </Match>
      </Switch>
    </CurrentEquipDrawer>
  );
};
