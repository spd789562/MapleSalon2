import { createMemo, Switch, Match, from } from 'solid-js';
import { computed } from 'nanostores';
import { useStore } from '@nanostores/solid';

import {
  $equipmentDrawerEquipListType,
  $equipmentDrawerExperimentCharacterRender,
  EquipListType,
} from '@/store/equipDrawer';
import type { EquipItem } from '@/store/string';
import {
  $equipmentFavoriteEquipCategory,
  $equipmentFavoriteEquipFilteredString,
} from '@/store/equipFavorite';
import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { EquipItemButton } from '@/components/drawer/EqupimentDrawer/Equip/EquipItemButton';
import { EquipItemRowButton } from '@/components/drawer/EqupimentDrawer/Equip/EquipitemRowButton';

const $equipRenderType = computed(
  [
    $equipmentDrawerEquipListType,
    $equipmentFavoriteEquipCategory,
    $equipmentDrawerExperimentCharacterRender,
  ],
  (listType, equipTab, experimentalCharacterRendering) => {
    if (
      experimentalCharacterRendering &&
      (equipTab === 'Face' || equipTab === 'Hair')
    ) {
      return EquipListType.Character;
    }
    return listType;
  },
);

const ColumnCountMap = {
  [EquipListType.Row]: 1,
  [EquipListType.Icon]: 7,
  [EquipListType.Character]: 5,
};

const DefaultHeightMap = {
  [EquipListType.Row]: 36,
  [EquipListType.Icon]: 45,
  [EquipListType.Character]: 90,
};

export const FavoriteList = () => {
  const equipRenderType = useStore($equipRenderType);
  const equipStrings = from($equipmentFavoriteEquipFilteredString);

  const columnCount = createMemo(() => ColumnCountMap[equipRenderType()]);
  const defaultItemHeight = createMemo(
    () => DefaultHeightMap[equipRenderType()],
  );

  return (
    <RowVirtualizer
      defaultItemHeight={defaultItemHeight()}
      columnCount={columnCount()}
      renderItem={(item, index) => (
        <Switch>
          <Match when={equipRenderType() === EquipListType.Character}>
            <EquipItemButton
              item={item}
              index={index}
              columnCount={columnCount()}
              type={EquipListType.Character}
            />
          </Match>
          <Match when={equipRenderType() === EquipListType.Icon}>
            <EquipItemButton
              item={item}
              index={index}
              columnCount={columnCount()}
              type={EquipListType.Icon}
            />
          </Match>
          <Match when={equipRenderType() === EquipListType.Row}>
            <EquipItemRowButton item={item} />
          </Match>
        </Switch>
      )}
      data={(equipStrings() || []) as EquipItem[]}
    />
  );
};
