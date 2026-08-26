import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $characterBrowseSearch } from '@/store/characterDrawer';

import CloseIcon from 'lucide-solid/icons/x';
import { Flex } from 'styled-system/jsx/flex';
import { Input } from '@/components/ui/input';
import { IconButton } from '@/components/ui/icon-button';

import { debounce } from 'throttle-debounce';

export const CharacterSearchInput = () => {
  const t = useTranslate();
  const search = useStore($characterBrowseSearch);

  const handleSearch = debounce(300, (value: string) => {
    $characterBrowseSearch.set(value);
  });

  function handleReset(_: unknown) {
    $characterBrowseSearch.set('');
  }

  return (
    <Flex align="center" position="relative">
      <Input
        placeholder={t('common.characterSearchPlaceholder')}
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
          title={t('common.clearSearch')}
        >
          <CloseIcon />
        </IconButton>
      </Show>
    </Flex>
  );
};
