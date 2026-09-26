import { Switch, Match } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { usePureStore } from '@/store';

import { $chairFilterdStrings } from '@/store/chair';
import {
  $equipmentDrawerEquipListType,
  EquipListType,
} from '@/store/equipDrawer';
import { useEquipDrawerListLayout } from '@/hook/equipDrawerList';

import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { ChairButton } from './ChairButton';
import { ChairRowButton } from './ChairRowButton';

export const ChairList = () => {
  const equipRenderType = useStore($equipmentDrawerEquipListType);
  const chairStrings = usePureStore($chairFilterdStrings);
  const { columnCount, itemHeight } = useEquipDrawerListLayout(equipRenderType);

  return (
    <RowVirtualizer
      defaultItemHeight={itemHeight()}
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
