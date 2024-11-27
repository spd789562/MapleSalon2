import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import {
  $equipmentFavoriteSearch,
  $equipmentFavoriteEquipCategory,
  $currentEquipmentFavoriteSearch,
} from '@/store/equipFavorite';

import CloseIcon from 'lucide-solid/icons/x';
import { Flex } from 'styled-system/jsx/flex';
import { Input } from '@/components/ui/input';
import { IconButton } from '@/components/ui/icon-button';

import { debounce } from 'throttle-debounce';

export const FavoriteSearchInput = () => {
  const search = useStore($currentEquipmentFavoriteSearch);

  const handleSearch = debounce(300, (value: string) => {
    $equipmentFavoriteSearch.setKey(
      $equipmentFavoriteEquipCategory.get(),
      value,
    );
  });

  function handleReset(_: unknown) {
    $equipmentFavoriteSearch.setKey(
      $equipmentFavoriteEquipCategory.get(),
      undefined,
    );
  }

  return (
    <Flex align="center" position="relative">
      <Input
        placeholder="Search..."
        value={search()}
        onInput={(e) => handleSearch(e.target.value)}
        minWidth={6}
        flex={1}
      />
      <Show when={!!search()}>
        <IconButton
          variant="ghost"
          position="absolute"
          right="1"
          onClick={handleReset}
          size="xs"
        >
          <CloseIcon />
        </IconButton>
      </Show>
    </Flex>
  );
};
