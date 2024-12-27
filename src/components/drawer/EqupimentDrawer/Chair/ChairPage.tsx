import { Show, onMount } from 'solid-js';
import { useStore } from '@nanostores/solid';

import {
  $isChairUninitialized,
  prepareAndFetchChairStrings,
} from '@/store/chair';

import { Grid } from 'styled-system/jsx/grid';
import { EquipListTypeButton } from '@/components/drawer/EqupimentDrawer/EquipListTypeButton';
import { UninitializedModal } from '../UninitializedModal';
import { ChairSearchInput } from './ChairSearchInput';
import { ChairList } from './ChairList';

export const ChairPage = () => {
  const isUninitialized = useStore($isChairUninitialized);

  onMount(async () => {
    if ($isChairUninitialized.get()) {
      await prepareAndFetchChairStrings();
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
        <ChairSearchInput />
        <EquipListTypeButton />
      </Grid>
      <ChairList />
      <Show when={isUninitialized()}>
        <UninitializedModal />
      </Show>
    </Grid>
  );
};
