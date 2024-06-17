import { usePureStore } from '@/store';

import {
  $equipmentDrawerEquipFilteredString,
  $equipmentDrawerHover,
} from '@/store/equipDrawer';

import { CssTooltip } from '@/components/ui/cssTooltip';
import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { LoadableEquipIcon } from '@/components/LoadableEquipIcon';

const ColumnCount = 7;

export const EquipList = () => {
  const equipStrings = usePureStore($equipmentDrawerEquipFilteredString);

  const handleHover = (item: string) => {
    $equipmentDrawerHover.set(item);
  };

  return (
    <RowVirtualizer
      columnCount={ColumnCount}
      renderItem={(item, index) => (
        <CssTooltip
          p={1}
          placement={
            index === 0
              ? 'right'
              : index + 1 === ColumnCount
                ? 'left'
                : 'center'
          }
          data-tooltip-content={item.name}
        >
          <LoadableEquipIcon id={item.id} name={item.name} />
        </CssTooltip>
      )}
      data={equipStrings()}
    />
  );
};
