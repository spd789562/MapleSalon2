import { Switch, Match } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $toolTab } from '@/store/toolTab';

import { HairDyeTab } from './HairDyeTab';

import { ToolTab } from '@/const/toolTab';

export const ToolTabPage = () => {
  const tab = useStore($toolTab);

  return (
    <Switch>
      <Match when={tab() === ToolTab.HairDye}>
        <HairDyeTab />
      </Match>
    </Switch>
  );
};
