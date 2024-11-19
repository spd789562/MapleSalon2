import { Switch, Match } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import type { EquipItem } from '@/store/string';
import { selectNewItem } from '@/store/character/action';

import { CssTooltip } from '@/components/ui/cssTooltip';
import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';
import { CharacterAvatar } from './CharacterAvatar';

export interface EquipItemButtonProps {
  item: EquipItem;
  index: number;
  columnCount: number;
  type: 'icon' | 'character';
}
export const EquipItemButton = (props: EquipItemButtonProps) => {
  function handleClick() {
    selectNewItem({
      id: props.item.id,
      name: props.item.name,
      hasEffect: props.item.hasEffect,
      isDyeable: props.item.isDyeable,
      isNameTag: props.item.isNameTag,
      isChatBalloon: props.item.isChatBalloon,
    });
  }

  return (
    <EquipItemButtonContainer p="1" type="button" onClick={handleClick}>
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
        <Switch>
          <Match when={props.type === 'character'}>
            <CharacterAvatar id={props.item.id} name={props.item.name} />
          </Match>
          <Match when={props.type === 'icon'}>
            <LoadableEquipIcon
              id={props.item.id}
              name={props.item.name}
              isDyeable={props.item.isDyeable}
            />
          </Match>
        </Switch>
      </CssTooltip>
    </EquipItemButtonContainer>
  );
};

const EquipItemButtonContainer = styled('button', {
  base: {
    width: 'full',
    height: 'full',
  },
});
