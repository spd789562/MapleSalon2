import { styled } from 'styled-system/jsx/factory';

import { selectSkill, type SkillItem } from '@/store/skill';

import { CssTooltip } from '@/components/ui/cssTooltip';
import { LoadableSkillIcon } from '@/components/elements/LoadableSkillIcon';

export interface SkillButtonProps {
  item: SkillItem;
  index: number;
  columnCount: number;
}
export const SkillButton = (props: SkillButtonProps) => {
  function handleClick() {
    selectSkill(props.item);
  }

  return (
    <SkillButtonContainer p="1" type="button" onClick={handleClick}>
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
        <LoadableSkillIcon
          id={props.item.id}
          name={props.item.name}
          folder={props.item.folder}
        />
      </CssTooltip>
    </SkillButtonContainer>
  );
};

const SkillButtonContainer = styled('button', {
  base: {
    width: 'full',
    height: 'full',
  },
});
