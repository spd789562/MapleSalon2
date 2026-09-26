import { Switch, Match } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { usePureStore } from '@/store';

import { $mountFilterdStrings } from '@/store/mount';
import {
  $equipmentDrawerEquipListType,
  EquipListType,
} from '@/store/equipDrawer';
import { useEquipDrawerListLayout } from '@/hook/equipDrawerList';

import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { MountButton } from './MountButton';
import { MountRowButton } from './MountRowButton';

export const MountList = () => {
  const equipRenderType = useStore($equipmentDrawerEquipListType);
  const mountStrings = usePureStore($mountFilterdStrings);
  const { columnCount, itemHeight } = useEquipDrawerListLayout(equipRenderType);

  return (
    <RowVirtualizer
      defaultItemHeight={itemHeight()}
      columnCount={columnCount()}
      renderItem={(item, index) => (
        <Switch>
          <Match when={equipRenderType() === EquipListType.Icon}>
            <MountButton
              item={item}
              index={index}
              columnCount={columnCount()}
            />
          </Match>
          <Match when={equipRenderType() === EquipListType.Row}>
            <MountRowButton item={item} />
          </Match>
        </Switch>
      )}
      data={mountStrings()}
    />
  );
};
