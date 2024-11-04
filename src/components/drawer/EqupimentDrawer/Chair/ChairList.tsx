import { createMemo, Switch, Match } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { usePureStore } from '@/store';

import { $chairFilterdStrings } from '@/store/chair';
import {
  $equipmentDrawerEquipListType,
  EquipListType,
} from '@/store/equipDrawer';

import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { ChairButton } from './ChairButton';
import { ChairRowButton } from './ChairRowButton';

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

export const ChairList = () => {
  const equipRenderType = useStore($equipmentDrawerEquipListType);
  const chairStrings = usePureStore($chairFilterdStrings);

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
          <Match when={equipRenderType() === EquipListType.Icon}>
            <ChairButton
              item={item}
              index={index}
              columnCount={columnCount()}
            />
          </Match>
          <Match when={equipRenderType() === EquipListType.Row}>
            <ChairRowButton item={item} />
          </Match>
        </Switch>
      )}
      data={chairStrings()}
    />
  );
};
