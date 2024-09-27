import { Match, Switch } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $toolTab } from '@/store/toolTab';

import { Grid } from 'styled-system/jsx/grid';
import { EquipDrawer } from './EquipDrawer';
import { EquipEdit } from '@/components/EquipEdit';
import { EquipTabs } from './EquipTabs';
import { EquipSearchInput } from './EqupiSearchInput';
import { EquipList } from './EquipList';
import { CategorySelectionDialog } from './CategorySelectionDialog';
import {
  CategorySelection,
  CategorySelectionToggle,
} from './CategorySelection';
import { CharacterRenderingSwitch } from './CharacterRenderingSwitch';
import { HideOnHistoryTab } from './HideOnHistoryTab';
import { MiniCharacterWindow } from './MiniCharacterWindow';

export const EqupimentDrawer = () => {
  const tab = useStore($toolTab);

  return (
    <EquipDrawer
      header={
        <Switch fallback={<EquipEdit />}>
          <Match when={tab() !== 'character'}>
            <MiniCharacterWindow />
          </Match>
        </Switch>
      }
      body={
        <Grid gridTemplateRows="auto 1fr" height="[100%]">
          <EquipTabs />
          <Grid position="relative" overflow="auto" gridTemplateRows="auto 1fr">
            <Grid gridTemplateColumns="1fr auto" p={1}>
              <CategorySelectionToggle />
              <CharacterRenderingSwitch />
              <HideOnHistoryTab>
                <EquipSearchInput />
              </HideOnHistoryTab>
            </Grid>
            <EquipList />
            <CategorySelectionDialog>
              <CategorySelection />
            </CategorySelectionDialog>
          </Grid>
        </Grid>
      }
    />
  );
};
