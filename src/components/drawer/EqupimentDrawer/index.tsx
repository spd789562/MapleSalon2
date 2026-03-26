import { Match, Switch } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { Box } from 'styled-system/jsx/box';

import { $toolTab } from '@/store/toolTab';

import { EquipEdit } from '@/components/EquipEdit';
import {
  PreviewEffectHsvAdjust,
  type PreviewEffectTarget,
} from '@/components/EquipEdit/PreviewEffectHsvAdjust';
import { EquipDrawer } from './EquipDrawer';
import { EquipPage } from './Equip/EquipPage';
import { ChairPage } from './Chair/ChairPage';
import { MountPage } from './Mount/MountPage';
import { SkillPage } from './Skill/SkillPage';
import { MiniCharacterWindow } from './MiniCharacter/MiniCharacterWindow';

import { ToolTab } from '@/const/toolTab';

const NONE_MINI_CHARACTER_TABS: (ToolTab | undefined)[] = [
  ToolTab.Character,
  ToolTab.AllAction,
  ToolTab.Chair,
  ToolTab.Mount,
  ToolTab.Skill,
];

const EFFECT_DYE_TABS: (ToolTab | undefined)[] = [
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
          <Match when={EFFECT_DYE_TABS.includes(tab())}>
            <Box maxH="16rem" overflow="auto" w="full">
              <PreviewEffectHsvAdjust target={tab() as PreviewEffectTarget} />
            </Box>
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
