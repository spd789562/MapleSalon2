import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $mapSearch } from '@/store/mapleMap';

import CloseIcon from 'lucide-solid/icons/x';
import { Flex } from 'styled-system/jsx/flex';
import { Input } from '@/components/ui/input';
import { IconButton } from '@/components/ui/icon-button';

import { debounce } from 'throttle-debounce';

export const MapSearchInput = () => {
  const search = useStore($mapSearch);

  const handleSearch = debounce(300, (value: string) => {
    $mapSearch.set(value);
  });

  function handleReset(_: unknown) {
    $mapSearch.set('');
  }

  return (
    <Flex align="center" position="relative">
      <Input
        placeholder="Search..."
        value={search()}
        onInput={(e) => handleSearch(e.target.value)}
        minWidth="unset"
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
