import { $currentItem } from '@/store/character';
import type { EquipItem } from '@/store/string';

import { CssTooltip } from '@/components/ui/cssTooltip';
import { LoadableEquipIcon } from '@/components/LoadableEquipIcon';

const ColumnCount = 7;

export interface EquipItemButtonProps {
  item: EquipItem;
  index: number;
}
export const EquipItemButton = (props: EquipItemButtonProps) => {
  function handleClick() {
    $currentItem.set({ id: props.item.id, name: props.item.name });
  }

  return (
    <button type="button" onClick={handleClick}>
      <CssTooltip
        p={1}
        placement={
          props.index === 0
            ? 'right'
            : props.index + 1 === ColumnCount
              ? 'left'
              : 'center'
        }
        data-tooltip-content={props.item.name}
      >
        <LoadableEquipIcon id={props.item.id} name={props.item.name} />
      </CssTooltip>
    </button>
  );
};
