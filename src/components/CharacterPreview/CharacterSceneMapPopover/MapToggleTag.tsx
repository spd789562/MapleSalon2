import { from, For, Show } from 'solid-js';
import type { WritableAtom } from 'nanostores';

import { type TagItem, toggleMapTag } from '@/store/mapleMap';

import { HStack } from 'styled-system/jsx/hstack';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';

export interface MapToggleTagProps {
  target: WritableAtom<TagItem[]>;
}
export const MapToggleTag = (props: MapToggleTagProps) => {
  const tags = from(props.target);

  function handleToggle(tag: TagItem) {
    toggleMapTag(props.target, tag.name);
  }

  return (
    <HStack flexWrap="wrap" gap="1">
      <For each={tags()}>
        {(tag) => (
          <Badge
            onClick={() => handleToggle(tag)}
            variant={tag.disabled ? 'subtle' : 'solid'}
            size="sm"
            cursor="pointer"
          >
            {tag.name}
          </Badge>
        )}
      </For>
      <Show when={tags()?.length === 0}>
        <Text size="sm">無標籤</Text>
      </Show>
    </HStack>
  );
};
