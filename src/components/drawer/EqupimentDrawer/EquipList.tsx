import { createMemo } from 'solid-js';
import { computed } from 'nanostores';
import { useStore } from '@nanostores/solid';
import { usePureStore } from '@/store';

import {
  $equipmentDrawerEquipFilteredString,
  $equipmentDrawerEquipTab,
  $equipmentDrawerExperimentCharacterRender,
  EquipTab,
} from '@/store/equipDrawer';
import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { EquipItemButton } from './EquipItemButton';

const $equipRenderType = computed(
  [$equipmentDrawerEquipTab, $equipmentDrawerExperimentCharacterRender],
  (equipTab, experimentalCharacterRendering) => {
    if (
      experimentalCharacterRendering &&
      (equipTab === EquipTab.Face || equipTab === EquipTab.Hair)
    ) {
      return 'character';
    }
    return 'icon';
  },
);

export const EquipList = () => {
  const equipRenderType = useStore($equipRenderType);
  const equipStrings = usePureStore($equipmentDrawerEquipFilteredString);

  const columnCount = createMemo(() =>
    equipRenderType() === 'character' ? 5 : 7,
  );
  const defaultItemHeight = createMemo(() =>
    equipRenderType() === 'character' ? 90 : 45,
  );

  return (
    <RowVirtualizer
      defaultItemHeight={defaultItemHeight()}
      columnCount={columnCount()}
      renderItem={(item, index) => (
        <EquipItemButton
          item={item}
          index={index}
          columnCount={columnCount()}
          type={equipRenderType()}
        />
      )}
      data={equipStrings()}
    />
  );
};
