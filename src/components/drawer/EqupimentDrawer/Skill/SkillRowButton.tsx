import { styled } from 'styled-system/jsx/factory';

import { selectSkill, type SkillItem } from '@/store/skill';

import { LoadableSkillIcon } from '@/components/elements/LoadableSkillIcon';
import { Text } from '@/components/ui/text';
import { PureTextClipboard } from '@/components/ui/clipboard';

import { rowFontSize } from '@/components/drawer/EqupimentDrawer/Equip/EquipitemRowButton';

export interface SkillRowButtonProps {
  item: SkillItem;
}
export const SkillRowButton = (props: SkillRowButtonProps) => {
  function handleClick() {
    selectSkill(props.item);
  }
  function preventDefault(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <SkillButtonContainer type="button" onClick={handleClick}>
      <LoadableSkillIcon
        id={props.item.id}
        name={props.item.name}
        folder={props.item.folder}
      />
      <SkillId onClick={preventDefault}>
        <PureTextClipboard value={props.item.id.toString()} />
      </SkillId>
      <SkillName
        onClick={preventDefault}
        style={{ 'font-size': rowFontSize(props.item.name) }}
      >
        <PureTextClipboard value={props.item.name} />
      </SkillName>
    </SkillButtonContainer>
  );
};

const SkillButtonContainer = styled('button', {
  base: {
    width: 'full',
    height: 'full',
    display: 'grid',
    gridTemplateColumns: 'auto auto 1fr',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      bg: 'gray.3',
    },
  },
});

const SkillId = styled(Text, {
  base: {
    width: '7rem',
    cursor: 'pointer',
    '&:hover': {
      color: 'accent.10',
    },
  },
});

const SkillName = styled(Text, {
  base: {
    textAlign: 'left',
    cursor: 'pointer',
    '&:hover': {
      color: 'accent.10',
    },
    lineHeight: '1',
  },
});
