import { onMount, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import {
  $isSkillUninitialized,
  prepareAndFetchSkillStrings,
} from '@/store/skill';

import { Grid } from 'styled-system/jsx/grid';
import { EquipListTypeButton } from '@/components/drawer/EqupimentDrawer/EquipListTypeButton';
import { SkillSearchInput } from './SkillSearchInput';
import { SkillList } from './SkillList';
import { UninitializedModal } from '../UninitializedModal';

export const SkillPage = () => {
  const isUninitialized = useStore($isSkillUninitialized);

  onMount(async () => {
    if ($isSkillUninitialized.get()) {
      await prepareAndFetchSkillStrings();
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
        <SkillSearchInput />
        <EquipListTypeButton />
      </Grid>
      <SkillList />
      <Show when={isUninitialized()}>
        <UninitializedModal />
      </Show>
    </Grid>
  );
};
