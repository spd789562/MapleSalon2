import { onMount } from 'solid-js';

import { $isMountUninitialized, prepareAndFetchMountStrings } from '@/store/mount';

import { Grid } from 'styled-system/jsx/grid';
import { EquipListTypeButton } from '@/components/drawer/EqupimentDrawer/EquipListTypeButton';
import { MountSearchInput } from './MountSearchInput';
import { MountList } from './MountList';

export const MountPage = () => {

  onMount(async () => {
    if ($isMountUninitialized.get()) {
      await prepareAndFetchMountStrings();
    }
  });

  return (
    <Grid
      position="relative"
      overflow="auto"
      gridTemplateRows="auto 1fr"
      height="[100%]"
    >
      <Grid gridTemplateColumns="1fr auto" p={1}>
        <MountSearchInput />
        <EquipListTypeButton />
      </Grid>
      <MountList />
    </Grid>
  );
};
