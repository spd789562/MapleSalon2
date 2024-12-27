import { Index, createMemo } from 'solid-js';

import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import type { EquipCategorySelections } from '@/store/equipDrawer';
import {
  $equipmentFavoriteEquipCategory,
  $equipmentFavoriteEquipCategorySelectionOpen,
} from '@/store/equipFavorite';

import { Grid } from 'styled-system/jsx/grid';
import { Button } from '@/components/ui/button';
import * as RadioButtonGroup from '@/components/ui/radioButtonGroup';
import { CategoryIcon } from '@/components/elements/CategoryIcon';
import { EquipCategoryOptions } from '@/components/drawer/EqupimentDrawer/Equip/CategorySelection';

export const CategorySelection = () => {
  const t = useTranslate();
  const category = useStore($equipmentFavoriteEquipCategory);

  function handleChange(detail: RadioButtonGroup.ValueChangeDetails) {
    $equipmentFavoriteEquipCategory.set(
      detail.value as EquipCategorySelections,
    );
    $equipmentFavoriteEquipCategorySelectionOpen.set(false);
  }

  return (
    <RadioButtonGroup.Root value={category()} onValueChange={handleChange}>
      <Grid columns={3} gap={2}>
        <Index each={EquipCategoryOptions}>
          {(option) => (
            <RadioButtonGroup.Item value={option().id}>
              <RadioButtonGroup.ItemControl />
              <RadioButtonGroup.ItemHiddenInput />
              <RadioButtonGroup.ItemText>
                <CategoryIcon category={option().id} size={20} />
                {t(option().label) as string}
              </RadioButtonGroup.ItemText>
            </RadioButtonGroup.Item>
          )}
        </Index>
      </Grid>
    </RadioButtonGroup.Root>
  );
};

export const CategorySelectionToggle = () => {
  const t = useTranslate();
  const category = useStore($equipmentFavoriteEquipCategory);

  const option = createMemo(
    () =>
      EquipCategoryOptions.find((o) => o.id === category()) ||
      EquipCategoryOptions[EquipCategoryOptions.length - 1],
  );

  function handleClick(_: unknown) {
    $equipmentFavoriteEquipCategorySelectionOpen.set(true);
  }

  return (
    <Button variant="outline" w={32} onClick={handleClick}>
      <CategoryIcon category={option().id} size={20} />
      {t(option().label) as string}
    </Button>
  );
};
