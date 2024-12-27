import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $skillSearch } from '@/store/skill';

import CloseIcon from 'lucide-solid/icons/x';
import { Flex } from 'styled-system/jsx/flex';
import { Input } from '@/components/ui/input';
import { IconButton } from '@/components/ui/icon-button';

import { debounce } from 'throttle-debounce';

export const SkillSearchInput = () => {
  const t = useTranslate();
  const search = useStore($skillSearch);

  const handleSearch = debounce(300, (value: string) => {
    $skillSearch.set(value);
  });

  function handleReset(_: unknown) {
    $skillSearch.set('');
  }

  return (
    <Flex align="center" position="relative">
      <Input
        placeholder={t('common.skillSearchPlaceholder')}
        value={search()}
        onInput={(e) => handleSearch(e.target.value)}
        minWidth="unset"
        flex={1}
      />
      <Show when={!!search()}>
        <IconButton
          aria-lable={t('common.clearSearch')}
          title={t('common.clearSearch')}
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
