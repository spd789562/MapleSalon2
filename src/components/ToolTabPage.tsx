import { Switch, Match } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $toolTab } from '@/store/toolTab';

import { ActionTab } from './ActionTab';
import { HairDyeTab } from './DyeTab/HairDyeTab';
import { FaceDyeTab } from './DyeTab/FaceDyeTab';

import { ToolTab } from '@/const/toolTab';

export const ToolTabPage = () => {
  const tab = useStore($toolTab);

  return (
    <Switch>
      <Match when={tab() === ToolTab.AllAction}>
        <ActionTab />
      </Match>
      <Match when={tab() === ToolTab.HairDye}>
        <HairDyeTab />
      </Match>
      <Match when={tab() === ToolTab.FaceDye}>
        <FaceDyeTab />
      </Match>
    </Switch>
  );
};
