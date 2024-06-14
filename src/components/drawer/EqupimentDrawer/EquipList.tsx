import { usePureStore } from '@/store';

import {
  $equipmentDrawerEquipFilteredString,
  $equipmentDrawerHover,
} from '@/store/equipDrawer';

import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { LoadableEquipIcon } from '@/components/LoadableEquipIcon';
import { Box } from 'styled-system/jsx/box';

export const EquipList = () => {
  const equipStrings = usePureStore($equipmentDrawerEquipFilteredString);

  const handleHover = (item: string) => {
    $equipmentDrawerHover.set(item);
  };

  return (
    <RowVirtualizer
      columnCount={7}
      renderItem={(item) => (
        <Box p={1} onMouseEnter={() => handleHover(item.name)}>
          <LoadableEquipIcon id={item.id} name={item.name} />
        </Box>
      )}
      data={equipStrings()}
    />
  );
};
