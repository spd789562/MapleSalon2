import { Index, Show, createMemo } from 'solid-js';

import { useStore } from '@nanostores/solid';

import {
  $equipmentDrawerEquipCategory,
  $isShowEquipCategorySelection,
  $equipmentDrawerEquipCategorySelectionOpen,
  type EquipCategorySelections,
} from '@/store/equipDrawer';

import { Grid } from 'styled-system/jsx/grid';
import { Button } from '@/components/ui/button';
import * as RadioButtonGroup from '@/components/ui/radioButtonGroup';
import { CategorySelectionIcon } from './CategorySelectionIcon';

import { AllCategory } from '@/const/equipments';

const options: {
  id: EquipCategorySelections;
  label: string;
}[] = [
  { id: AllCategory, label: '全部' },
  { id: 'Weapon', label: '武器' },
  { id: 'CashWeapon', label: '時裝武器' },
  { id: 'Cap', label: '帽子' },
  { id: 'Overall', label: '套服' },
  { id: 'Coat', label: '上衣' },
  { id: 'Pants', label: '下衣' },
  { id: 'Cape', label: '披風' },
  { id: 'Glove', label: '手套' },
  { id: 'Shoes', label: '鞋子' },
  { id: 'Eye Decoration', label: '眼飾' },
  { id: 'Face Accessory', label: '臉飾' },
  { id: 'Earrings', label: '耳環' },
  { id: 'Shield', label: '盾牌' },
  { id: 'Skin', label: '膚色' },
];

export const CategorySelection = () => {
  const category = useStore($equipmentDrawerEquipCategory);

  function handleChange(detail: RadioButtonGroup.ValueChangeDetails) {
    $equipmentDrawerEquipCategory.set(detail.value as EquipCategorySelections);
    $equipmentDrawerEquipCategorySelectionOpen.set(false);
  }

  return (
    <RadioButtonGroup.Root value={category()} onValueChange={handleChange}>
      <Grid columns={3} gap={2}>
        <Index each={options}>
          {(option) => (
            <RadioButtonGroup.Item value={option().id}>
              <RadioButtonGroup.ItemControl />
              <RadioButtonGroup.ItemHiddenInput />
              <RadioButtonGroup.ItemText>
                <CategorySelectionIcon category={option().id} size={20} />
                {option().label}
              </RadioButtonGroup.ItemText>
            </RadioButtonGroup.Item>
          )}
        </Index>
      </Grid>
    </RadioButtonGroup.Root>
  );
};

export const CategorySelectionToggle = () => {
  const category = useStore($equipmentDrawerEquipCategory);
  const isShowing = useStore($isShowEquipCategorySelection);

  const option = createMemo(
    () =>
      options.find((o) => o.id === category()) || options[options.length - 1],
  );

  function handleClick(_: unknown) {
    $equipmentDrawerEquipCategorySelectionOpen.set(true);
  }

  return (
    <Show when={isShowing()}>
      <Button variant="outline" w={32} onClick={handleClick}>
        <CategorySelectionIcon category={option().id} size={20} />
        {option().label}
      </Button>
    </Show>
  );
};
