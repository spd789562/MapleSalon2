import { createSignal } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import {
  isFavoriteEquip,
  appendFavoriteEquip,
  removeFavoriteEquip,
} from '@/store/equipFavorite';
import type { EquipItem } from '@/store/string';

import StarIcon from 'lucide-solid/icons/star';

export interface AddToFavoriteButtonProps {
  id: number;
  item: EquipItem;
  showWhenFavorite?: boolean;
}
export const AddToFavoriteButton = (props: AddToFavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = createSignal(isFavoriteEquip(props.id));

  function handleClick(event: MouseEvent) {
    event.stopPropagation();
    if (isFavorite()) {
      removeFavoriteEquip(props.item);
    } else {
      appendFavoriteEquip(props.item);
    }
    setIsFavorite(isFavoriteEquip(props.id));
  }

  return (
    <Button
      onClick={handleClick}
      title={isFavorite() ? '移除收藏' : '加入收藏'}
      data-active={isFavorite() || undefined}
      class="favorite-button"
    >
      <StarIcon size="16" />
    </Button>
  );
};

const Button = styled('button', {
  base: {
    padding: '0',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    color: 'currentColor',
    transition: 'color 0.2s',
    '&:hover': {
      color: 'amber.9',
    },
    '&[data-active]': {
      color: 'amber.9',
      '& > svg': {
        fill: 'var(--colors-amber-9)',
      },
    },
  },
});
