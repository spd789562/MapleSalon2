import { from, For, Show } from 'solid-js';
import { useTranslate, type I18nKeys } from '@/context/i18n';

import { type TagItem, toggleMapTag, $mapLayerTags } from '@/store/mapleMap';

import { HStack } from 'styled-system/jsx/hstack';
import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';

const TranslateMap: Record<string, I18nKeys> = {
  background: 'scene.mapTagBackground',
  foreground: 'scene.mapTagForeground',
  particle: 'scene.mapTagParticle',
};

export const MapLayerToggleTag = () => {
  const t = useTranslate();
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
              {(name) => t(name()) as string}
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
