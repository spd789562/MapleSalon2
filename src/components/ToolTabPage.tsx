import { Switch, Match } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $toolTab } from '@/store/toolTab';

import { CharacterPreview } from './CharacterPreview';
import { ActionTab } from './tab/ActionTab';
import { HairDyeTab } from './tab/DyeTab/HairDyeTab';
import { FaceDyeTab } from './tab/DyeTab/FaceDyeTab';
import { ItemDyeTab } from './tab/ItemDyeTab';
import { ChairTab } from './tab/ChairTab';

import { ToolTab } from '@/const/toolTab';

export const ToolTabPage = () => {
  const tab = useStore($toolTab);

  return (
    <Switch>
      <Match when={tab() === ToolTab.Character}>
        <CharacterPreview />
      </Match>
      <Match when={tab() === ToolTab.AllAction}>
        <ActionTab />
      </Match>
      <Match when={tab() === ToolTab.HairDye}>
        <HairDyeTab />
      </Match>
      <Match when={tab() === ToolTab.FaceDye}>
        <FaceDyeTab />
      </Match>
      <Match when={tab() === ToolTab.ItemDye}>
        <ItemDyeTab />
      </Match>
      <Match when={tab() === ToolTab.Chair}>
        <ChairTab />
      </Match>
    </Switch>
  );
};
