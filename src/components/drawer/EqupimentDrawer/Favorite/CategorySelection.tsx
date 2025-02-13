import { Index, createMemo } from 'solid-js';

import { useStore } from '@nanostores/solid';
import { useTranslate, type I18nKeys } from '@/context/i18n';

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

export const EquipCategoryOptions: {
  id: EquipCategorySelections;
  label: I18nKeys;
}[] = [
  { id: AllCategory, label: 'character.equipAll' },
  { id: 'Hair', label: 'tab.hair' },
  { id: 'Face', label: 'tab.face' },
  { id: 'Weapon', label: 'character.equipWeapon' },
  { id: 'CashWeapon', label: 'character.equipCashWeapon' },
  { id: 'Cap', label: 'character.equipCap' },
  { id: 'Overall', label: 'character.equipOverall' },
  { id: 'Coat', label: 'character.equipCoat' },
  { id: 'Pants', label: 'character.equipPants' },
  { id: 'Cape', label: 'character.equipCape' },
  { id: 'Glove', label: 'character.equipGlove' },
  { id: 'Shoes', label: 'character.equipShoes' },
  { id: 'Eye Decoration', label: 'character.equipEyeDecoration' },
  { id: 'Face Accessory', label: 'character.equipFaceAccessory' },
  { id: 'Earrings', label: 'character.equipEarrings' },
  { id: 'Shield', label: 'character.equipShield' },
  { id: 'Skin', label: 'character.equipSkin' },
  { id: 'NameTag', label: 'character.equipNameTag' },
  { id: 'ChatBalloon', label: 'character.equipChatBalloon' },
  { id: 'Medal', label: 'character.equipMedal' },
  { id: 'NickTag', label: 'character.equipNickTag' },
  { id: 'Effect', label: 'character.equipEffect' },
  { id: 'RingEffect', label: 'character.equipRingEffect' },
  { id: 'NecklaceEffect', label: 'character.equipNecklaceEffect' },
];

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
