import { styled } from 'styled-system/jsx/factory';

import { selectChair, type ChairItem } from '@/store/chair';

import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';
import { Text } from '@/components/ui/text';
import { PureTextClipboard } from '@/components/ui/clipboard';

export interface ChairRowButtonProps {
  item: ChairItem;
}
export const ChairRowButton = (props: ChairRowButtonProps) => {
  function handleClick() {
    selectChair(props.item);
  }
  function preventDefault(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }

  return (
    <ChairButtonContainer type="button" onClick={handleClick}>
      <LoadableEquipIcon
        id={props.item.id}
        name={props.item.name}
        folder={props.item.folder}
      />
      <ChairId onClick={preventDefault}>
        <PureTextClipboard value={props.item.id.toString()} />
      </ChairId>
      <ChairName onClick={preventDefault}>
        <PureTextClipboard value={props.item.name} />
      </ChairName>
    </ChairButtonContainer>
  );
};

const ChairButtonContainer = styled('button', {
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

const ChairId = styled(Text, {
  base: {
    width: '7rem',
    cursor: 'pointer',
    '&:hover': {
      color: 'accent.10',
    },
  },
});

const ChairName = styled(Text, {
  base: {
    textAlign: 'left',
    cursor: 'pointer',
    '&:hover': {
      color: 'accent.10',
    },
  },
});
