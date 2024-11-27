import { Grid } from 'styled-system/jsx/grid';
import { EquipListTypeButton } from '@/components/drawer/EqupimentDrawer/EquipListTypeButton';
import { FavoriteSearchInput } from './FavoriteSearchInput';
import { FavoriteList } from './FavoriteList';
import { CategorySelectionDialog } from './CategorySelectionDialog';
import {
  CategorySelection,
  CategorySelectionToggle,
} from './CategorySelection';

export const FavoritePage = () => {
  return (
    <Grid position="relative" overflow="auto" gridTemplateRows="auto 1fr">
      <Grid gridTemplateColumns="auto auto 1fr" p={1}>
        <CategorySelectionToggle />
        <FavoriteSearchInput />
        <EquipListTypeButton />
      </Grid>
      <FavoriteList />
      <CategorySelectionDialog>
        <CategorySelection />
      </CategorySelectionDialog>
    </Grid>
  );
};
