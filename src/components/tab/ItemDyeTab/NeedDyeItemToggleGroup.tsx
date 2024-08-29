import { For, Index } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $onlyShowDyeable } from '@/store/toolTab';

import { Grid } from 'styled-system/jsx/grid';
import * as ToggleGroup from '@/components/ui/toggleGroup';

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
  const onlyShowDyeable = useStore($onlyShowDyeable);

  return (
    <ToggleGroup.Root
      multiple={true}
      width="full"
      py="0.5"
      borderColor="transparent"
    >
      <Grid width="full" columns={7}>
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
      </Grid>
    </ToggleGroup.Root>
  );
};
