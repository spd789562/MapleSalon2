import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $isChairUninitialized } from '@/store/chair';

import { Grid } from 'styled-system/jsx/grid';
import { EquipListTypeButton } from '@/components/drawer/EqupimentDrawer/EquipListTypeButton';
import { ChairSearchInput } from './ChairSearchInput';
import { ChairList } from './ChairList';
import { ChairUninitializedModal } from './ChairUninitializedModal';

export const ChairPage = () => {
  const isUninitialized = useStore($isChairUninitialized);

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
      <Show when={isUninitialized()}>
        <ChairUninitializedModal />
      </Show>
    </Grid>
  );
};
