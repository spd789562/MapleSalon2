import { styled } from 'styled-system/jsx/factory';

import { selectMount, type MountItem } from '@/store/mount';

import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';
import { Text } from '@/components/ui/text';
import { PureTextClipboard } from '@/components/ui/clipboard';

import { rowFontSize } from '@/components/drawer/EqupimentDrawer/Equip/EquipitemRowButton';

export interface MountRowButtonProps {
  item: MountItem;
}
export const MountRowButton = (props: MountRowButtonProps) => {
  function handleClick() {
    selectMount(props.item);
  }
  function preventDefault(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <MountButtonContainer type="button" onClick={handleClick}>
      <LoadableEquipIcon id={props.item.id} name={props.item.name} />
      <MountId onClick={preventDefault}>
        <PureTextClipboard value={props.item.id.toString()} />
      </MountId>
      <MountName
        onClick={preventDefault}
        style={{ 'font-size': rowFontSize(props.item.name) }}
      >
        <PureTextClipboard value={props.item.name} />
      </MountName>
    </MountButtonContainer>
  );
};

const MountButtonContainer = styled('button', {
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

const MountId = styled(Text, {
  base: {
    width: '7rem',
    cursor: 'pointer',
    '&:hover': {
      color: 'accent.10',
    },
  },
});

const MountName = styled(Text, {
  base: {
    textAlign: 'left',
    cursor: 'pointer',
    '&:hover': {
      color: 'accent.10',
    },
    lineHeight: '1',
  },
});
