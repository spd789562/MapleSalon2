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

export const EquipPage = () => {
  return (
    <Grid gridTemplateRows="auto 1fr" height="[100%]">
      <EquipTabs />
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
    </Grid>
  );
};
