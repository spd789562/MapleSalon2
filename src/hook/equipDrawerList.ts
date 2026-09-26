import { createMemo, type Accessor } from 'solid-js';
import { useStore } from '@nanostores/solid';

import {
  $equipmentDrawerCharacterSize,
  $equipmentDrawerExtraColumns,
  $equipmentDrawerIconSize,
  $equipmentDrawerIconSizeConfig,
  getEquipDrawerColumnCount,
  getEquipDrawerItemHeight,
  type EquipListType,
} from '@/store/equipDrawer';

export function useEquipDrawerListLayout(listType: Accessor<EquipListType>) {
  const extraColumns = useStore($equipmentDrawerExtraColumns);
  const iconSize = useStore($equipmentDrawerIconSize);
  const characterSize = useStore($equipmentDrawerCharacterSize);

  const columnCount = createMemo(() =>
    getEquipDrawerColumnCount(
      listType(),
      extraColumns(),
      iconSize(),
      characterSize(),
    ),
  );
  const itemHeight = createMemo(() =>
    getEquipDrawerItemHeight(listType(), iconSize(), characterSize()),
  );

  return { columnCount, itemHeight };
}

export function useEquipDrawerIconDisplaySize() {
  const config = useStore($equipmentDrawerIconSizeConfig);
  return createMemo(() => `${config().displaySize}px`);
}
