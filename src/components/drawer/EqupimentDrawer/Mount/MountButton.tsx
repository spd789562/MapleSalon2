import { styled } from 'styled-system/jsx/factory';

import { selectMount, type MountItem } from '@/store/mount';

import { CssTooltip } from '@/components/ui/cssTooltip';
import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';

export interface MountButtonProps {
  item: MountItem;
  index: number;
  columnCount: number;
}
export const MountButton = (props: MountButtonProps) => {
  function handleClick() {
    selectMount(props.item);
  }

  return (
    <MountButtonContainer p="1" type="button" onClick={handleClick}>
      <CssTooltip
        width="full"
        height="full"
        placement={
          props.index === 0
            ? 'right'
            : props.index + 1 === props.columnCount
              ? 'left'
              : 'center'
        }
        data-tooltip-content={props.item.name}
      >
        <LoadableEquipIcon
          id={props.item.id}
          name={props.item.name}
        />
      </CssTooltip>
    </MountButtonContainer>
  );
};

const MountButtonContainer = styled('button', {
  base: {
    width: 'full',
    height: 'full',
  },
});
