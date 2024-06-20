import { Index, Show, createMemo, type Component } from 'solid-js';
import { Dynamic } from 'solid-js/web';

import { useStore } from '@nanostores/solid';

import {
  $equipmentDrawerEquipCategory,
  $isShowEquipCategorySelection,
  $equipmentDrawerEquipCategorySelectionOpen,
  type EquipCategorySelections,
} from '@/store/equipDrawer';

import type { LucideProps } from 'lucide-solid';
import LayoutGridIcon from 'lucide-solid/icons/layout-grid';

import { Grid } from 'styled-system/jsx/grid';
import { Button } from '@/components/ui/button';
import * as RadioButtonGroup from '@/components/ui/radioButtonGroup';

import { AllCategory } from '@/const/equipments';

const options: {
  id: EquipCategorySelections;
  label: string;
  icon: Component<LucideProps>;
}[] = [
  { id: 'Weapon', label: '武器', icon: LayoutGridIcon },
  { id: 'CashWeapon', label: '時裝武器', icon: LayoutGridIcon },
  { id: 'Cap', label: '帽子', icon: LayoutGridIcon },
  { id: 'Overall', label: '套服', icon: LayoutGridIcon },
  { id: 'Coat', label: '上衣', icon: LayoutGridIcon },
  { id: 'Pants', label: '下衣', icon: LayoutGridIcon },
  { id: 'Cape', label: '披風', icon: LayoutGridIcon },
  { id: 'Glove', label: '手套', icon: LayoutGridIcon },
  { id: 'Shoes', label: '鞋子', icon: LayoutGridIcon },
  { id: 'Eye Decoration', label: '眼飾', icon: LayoutGridIcon },
  { id: 'Face Accessory', label: '臉飾', icon: LayoutGridIcon },
  { id: 'Earrings', label: '耳環', icon: LayoutGridIcon },
  { id: 'Shield', label: '盾牌', icon: LayoutGridIcon },
  { id: 'Skin', label: '膚色', icon: LayoutGridIcon },
  { id: AllCategory, label: '全部', icon: LayoutGridIcon },
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
                <Dynamic component={option().icon} size={24} />
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
        <Dynamic component={option().icon} size={24} />
        {option().label}
      </Button>
    </Show>
  );
};
