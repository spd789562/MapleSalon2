import { Match, Switch } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $toolTab } from '@/store/toolTab';

import { EquipEdit } from '@/components/EquipEdit';
import { EquipDrawer } from './EquipDrawer';
import { EquipPage } from './Equip/EquipPage';
import { ChairPage } from './Chair/ChairPage';
import { MountPage } from './Mount/MountPage';
import { SkillPage } from './Skill/SkillPage';
import { MiniCharacterWindow } from './MiniCharacter/MiniCharacterWindow';

import { ToolTab } from '@/const/toolTab';

const NONE_MINI_CHARACTER_TABS: (ToolTab | undefined)[] = [
  ToolTab.Character,
  ToolTab.Chair,
  ToolTab.Mount,
  ToolTab.Skill,
];

export const EqupimentDrawer = () => {
  const tab = useStore($toolTab);

  return (
    <EquipDrawer
      header={
        <Switch fallback={<EquipEdit />}>
          <Match when={!NONE_MINI_CHARACTER_TABS.includes(tab())}>
            <MiniCharacterWindow />
          </Match>
        </Switch>
      }
      body={
        <Switch fallback={<EquipPage />}>
          <Match when={tab() === ToolTab.Chair}>
            <ChairPage />
          </Match>
          <Match when={tab() === ToolTab.Mount}>
            <MountPage />
          </Match>
          <Match when={tab() === ToolTab.Skill}>
            <SkillPage />
          </Match>
        </Switch>
      }
    />
  );
};
