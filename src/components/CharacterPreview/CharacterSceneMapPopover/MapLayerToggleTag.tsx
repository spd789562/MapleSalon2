import { from, For, Show } from 'solid-js';

import { type TagItem, toggleMapTag, $mapLayerTags } from '@/store/mapleMap';

import { HStack } from 'styled-system/jsx/hstack';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';

const TranslateMap = {
  background: '背景',
  foreground: '前景',
  particle: '粒子效果',
};

export const MapLayerToggleTag = () => {
  const tags = from($mapLayerTags);

  function handleToggle(tag: TagItem) {
    toggleMapTag($mapLayerTags, tag.name);
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
            <Show
              when={TranslateMap[tag.name as keyof typeof TranslateMap]}
              fallback={tag.name}
            >
              {(name) => name()}
            </Show>
          </Badge>
        )}
      </For>
      <Show when={tags()?.length === 0}>
        <Text size="sm">無標籤</Text>
      </Show>
    </HStack>
  );
};
