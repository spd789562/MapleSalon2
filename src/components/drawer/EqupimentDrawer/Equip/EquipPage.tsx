import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $isFavoriteTab, EquipTab } from '@/store/equipDrawer';

import { Grid } from 'styled-system/jsx/grid';
import { EquipTabs } from './EquipTabs';
import { EquipListTypeButton } from '@/components/drawer/EqupimentDrawer/EquipListTypeButton';
import { EquipSearchInput } from './EqupiSearchInput';
import { EquipList } from './EquipList';
import { CategorySelectionDialog } from './CategorySelectionDialog';
import {
  CategorySelection,
  CategorySelectionToggle,
} from './CategorySelection';
import { CharacterRenderingSwitch } from './CharacterRenderingSwitch';
import { HideOnHistoryTab } from './HideOnHistoryTab';
import { FavoritePage } from '../Favorite/FavoritePage';

export const EquipPage = () => {
  const isFavoriteTab = useStore($isFavoriteTab);

  return (
    <Grid gridTemplateRows="auto 1fr" height="[100%]">
      <EquipTabs />
      <Show when={!isFavoriteTab()} fallback={<FavoritePage />}>
        <Grid position="relative" overflow="auto" gridTemplateRows="auto 1fr">
          <Grid gridTemplateColumns="auto auto 1fr" p={1}>
            <CategorySelectionToggle />
            <CharacterRenderingSwitch />
            <HideOnHistoryTab>
              <EquipSearchInput />
            </HideOnHistoryTab>
            <EquipListTypeButton />
          </Grid>
          <EquipList />
          <CategorySelectionDialog>
            <CategorySelection />
          </CategorySelectionDialog>
        </Grid>
      </Show>
    </Grid>
  );
};
