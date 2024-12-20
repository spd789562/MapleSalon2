import { Index, createMemo } from 'solid-js';

import { useStore } from '@nanostores/solid';

import type { EquipCategorySelections } from '@/store/equipDrawer';
import {
  $equipmentFavoriteEquipCategory,
  $equipmentFavoriteEquipCategorySelectionOpen,
} from '@/store/equipFavorite';

import { Grid } from 'styled-system/jsx/grid';
import { Button } from '@/components/ui/button';
import * as RadioButtonGroup from '@/components/ui/radioButtonGroup';
import { CategoryIcon } from '@/components/elements/CategoryIcon';

import { AllCategory } from '@/const/equipments';

const options: {
  id: EquipCategorySelections;
  label: string;
}[] = [
  { id: AllCategory, label: '全部' },
  { id: 'Hair', label: '髮型' },
  { id: 'Face', label: '臉型' },
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
  { id: 'NameTag', label: '名牌' },
  { id: 'ChatBalloon', label: '聊天戒指' },
];

export const CategorySelection = () => {
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
        <Index each={options}>
          {(option) => (
            <RadioButtonGroup.Item value={option().id}>
              <RadioButtonGroup.ItemControl />
              <RadioButtonGroup.ItemHiddenInput />
              <RadioButtonGroup.ItemText>
                <CategoryIcon category={option().id} size={20} />
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
  const category = useStore($equipmentFavoriteEquipCategory);

  const option = createMemo(
    () =>
      options.find((o) => o.id === category()) || options[options.length - 1],
  );

  function handleClick(_: unknown) {
    $equipmentFavoriteEquipCategorySelectionOpen.set(true);
  }

  return (
    <Button variant="outline" w={32} onClick={handleClick}>
      <CategoryIcon category={option().id} size={20} />
      {option().label}
    </Button>
  );
};
