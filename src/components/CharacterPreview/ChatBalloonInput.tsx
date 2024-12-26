import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $chatBalloonContent } from '@/store/character/store';

import CloseIcon from 'lucide-solid/icons/x';
import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';
import { IconButton } from '@/components/ui/icon-button';

import { debounce } from 'throttle-debounce';

export interface ChatBalloonInputProps {
  id?: string;
}
export const ChatBalloonInput = (props: ChatBalloonInputProps) => {
  const t = useTranslate();
  const text = useStore($chatBalloonContent);

  const handleNameChange = debounce(300, (value: string) => {
    $chatBalloonContent.set(value);
  });

  function handleClear() {
    $chatBalloonContent.set('');
  }

  return (
    <HStack position="relative">
      <Text as="label" for={props.id ?? 'chat-content'}>
        {t('character.chatBalloon')}
      </Text>
      <Input
        id={props.id ?? 'chat-content'}
        placeholder={t('character.chatBalloonPlaceholder')}
        value={text()}
        onInput={(e) => handleNameChange(e.target.value)}
        minWidth={7}
        flex={1}
        size="sm"
        autocomplete="off"
      />
      <Show when={text()}>
        <IconButton
          onClick={handleClear}
          aria-label={t('character.chatBalloonClear')}
          title={t('character.chatBalloonClear')}
          variant="ghost"
          size="xs"
          position="absolute"
          right="0.5"
        >
          <CloseIcon />
        </IconButton>
      </Show>
    </HStack>
  );
};
