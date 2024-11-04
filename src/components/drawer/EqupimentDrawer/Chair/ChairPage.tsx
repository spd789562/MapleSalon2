import { Grid } from 'styled-system/jsx/grid';
import { EquipListTypeButton } from '@/components/drawer/EqupimentDrawer/EquipListTypeButton';
import { ChairSearchInput } from './ChairSearchInput';
import { ChairList } from './ChairList';

export const ChairPage = () => {
  return (
    <Grid
      position="relative"
      overflow="auto"
      gridTemplateRows="auto 1fr"
      height="[100%]"
    >
      <Grid gridTemplateColumns="1fr auto" p={1}>
        <ChairSearchInput />
        <EquipListTypeButton />
      </Grid>
      <ChairList />
    </Grid>
  );
};
