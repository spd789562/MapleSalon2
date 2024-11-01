import { styled } from 'styled-system/jsx/factory';

import { selectChair, type ChairItem } from '@/store/chair';

import { CssTooltip } from '@/components/ui/cssTooltip';
import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';

export interface ChairButtonProps {
  item: ChairItem;
  index: number;
  columnCount: number;
}
export const ChairButton = (props: ChairButtonProps) => {
  function handleClick() {
    selectChair(props.item);
  }

  return (
    <ChairButtonContainer p="1" type="button" onClick={handleClick}>
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
          folder={props.item.folder}
        />
      </CssTooltip>
    </ChairButtonContainer>
  );
};

const ChairButtonContainer = styled('button', {
  base: {
    width: 'full',
    height: 'full',
  },
});
