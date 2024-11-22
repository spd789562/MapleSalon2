import { Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useStore } from '@nanostores/solid';

import { $toolTab } from '@/store/toolTab';

import { CharacterPreview } from './CharacterPreview';
import { ActionTab } from './tab/ActionTab';
import { HairDyeTab } from './tab/DyeTab/HairDyeTab';
import { FaceDyeTab } from './tab/DyeTab/FaceDyeTab';
import { ItemDyeTab } from './tab/ItemDyeTab';
import { ChairTab } from './tab/ChairTab';
import { MountTab } from './tab/MountTab';

import { ToolTab } from '@/const/toolTab';

const tabMap = {
  [ToolTab.Character]: CharacterPreview,
  [ToolTab.AllAction]: ActionTab,
  [ToolTab.HairDye]: HairDyeTab,
  [ToolTab.FaceDye]: FaceDyeTab,
  [ToolTab.ItemDye]: ItemDyeTab,
  [ToolTab.Chair]: ChairTab,
  [ToolTab.Mount]: MountTab,
  [ToolTab.Skill]: MountTab,
};

export const ToolTabPage = () => {
  const tab = useStore($toolTab);

  return (
    <Show when={tab()}>{(tab) => <Dynamic component={tabMap[tab()]} />}</Show>
  );
};
