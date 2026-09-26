import { Switch, Match, from } from 'solid-js';
import { computed } from 'nanostores';
import { useStore } from '@nanostores/solid';

import {
  $equipmentDrawerEquipFilteredString,
  $equipmentDrawerEquipTab,
  $equipmentDrawerEquipListType,
  $equipmentDrawerExperimentCharacterRender,
  EquipTab,
  EquipListType,
} from '@/store/equipDrawer';
import type { EquipItem } from '@/store/string';
import { useEquipDrawerListLayout } from '@/hook/equipDrawerList';
import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { EquipItemButton } from './EquipItemButton';
import { EquipItemRowButton } from './EquipitemRowButton';

const $equipRenderType = computed(
  [
    $equipmentDrawerEquipListType,
    $equipmentDrawerEquipTab,
    $equipmentDrawerExperimentCharacterRender,
  ],
  (listType, equipTab, experimentalCharacterRendering) => {
    if (
      experimentalCharacterRendering &&
      (equipTab === EquipTab.Face || equipTab === EquipTab.Hair)
    ) {
      return EquipListType.Character;
    }
    return listType;
  },
);

export const EquipList = () => {
  const equipStrings = from($equipmentDrawerEquipFilteredString);
  const equipRenderType = useStore($equipRenderType);
  const { columnCount, itemHeight } = useEquipDrawerListLayout(equipRenderType);

  return (
    <RowVirtualizer
      id="equipment-list"
      defaultItemHeight={itemHeight()}
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
