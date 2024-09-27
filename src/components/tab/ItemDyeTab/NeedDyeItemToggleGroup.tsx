import { Index } from 'solid-js';

import { usePureStore } from '@/store';
import { $onlyShowDyeable, $selectedEquipSubCategory } from '@/store/toolTab';

import { Stack } from 'styled-system/jsx/stack';
import * as ToggleGroup from '@/components/ui/cancelableToggleGroup';

import { NeedDyeItem } from './NeedDyeItem';
import type { EquipSubCategory } from '@/const/equipments';

const CategoryList = [
  'Head',
  'Weapon',
  'Cap',
  'Cape',
  'Coat',
  'Glove',
  'Overall',
  'Pants',
  'Shield',
  'Shoes',
  'Face Accessory',
  'Eye Decoration',
  'Earrings',
] as EquipSubCategory[];

export const NeedDyeItemToggleGroup = () => {
  const onlyShowDyeable = usePureStore($onlyShowDyeable);

  const handleValueChange = (details: ToggleGroup.ValueChangeDetails) => {
    $selectedEquipSubCategory.set(details.value as EquipSubCategory[]);
  };

  return (
    <ToggleGroup.Root
      multiple={true}
      width="full"
      py="0.5"
      borderColor="transparent"
      defaultValue={$selectedEquipSubCategory.get()}
      onValueChange={handleValueChange}
    >
      <Stack width="full" direction="row" flexWrap="wrap">
        <Index each={CategoryList}>
          {(category) => (
            <ToggleGroup.Item
              value={category()}
              asChild={(props) => (
                <NeedDyeItem
                  category={category()}
                  onlyShowDyeable={onlyShowDyeable()}
                  {...props()}
                />
              )}
            />
          )}
        </Index>
      </Stack>
    </ToggleGroup.Root>
  );
};
