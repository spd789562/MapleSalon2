import { usePureStore } from '@/store';

import { $equipmentDrawerEquipFilteredString } from '@/store/equipDrawer';
import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { EquipItemButton } from './EquipItemButton';

const ColumnCount = 7;

export const EquipList = () => {
  const equipStrings = usePureStore($equipmentDrawerEquipFilteredString);

  return (
    <RowVirtualizer
      columnCount={ColumnCount}
      renderItem={(item, index) => (
        <EquipItemButton item={item} index={index} />
      )}
      data={equipStrings()}
    />
  );
};
