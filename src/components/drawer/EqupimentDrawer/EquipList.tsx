import { usePureStore } from '@/store';
import { $equipmentDrawerEquipFilteredString } from '@/store/equipDrawer';

import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { LoadableEquipIcon } from '@/components/LoadableEquipIcon';
import { EllipsisText as Text } from '@/components/ui/ellipsisText';
import { VStack } from 'styled-system/jsx/vstack';

export const EquipList = () => {
  const equipStrings = usePureStore($equipmentDrawerEquipFilteredString);

  return (
    <RowVirtualizer
      columnCount={5}
      renderItem={(item) => (
        <VStack>
          <LoadableEquipIcon id={item.id} name={item.name} />
          <Text clamp={2} size="xs">
            {item.name}
          </Text>
        </VStack>
      )}
      data={equipStrings()}
    />
  );
};
