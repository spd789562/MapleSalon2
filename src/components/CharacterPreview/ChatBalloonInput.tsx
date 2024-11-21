import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

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
        聊天文字
      </Text>
      <Input
        id={props.id ?? 'chat-content'}
        placeholder="輸入聊天泡泡內容"
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
          aria-label="清除聊天文字"
          title="清除聊天文字"
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
