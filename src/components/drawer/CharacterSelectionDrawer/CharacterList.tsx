import { For } from 'solid-js';

import { usePureStore } from '@/store';

import { $getCharacterIds } from '@/store/characterDrawer';

import { HStack } from 'styled-system/jsx/hstack';
import { CharacterItem } from './CharacterItem';

export const CharacterList = () => {
  let scrollContainerRef!: HTMLDivElement;
  const characterIds = usePureStore($getCharacterIds);

  function hanedleHorizontalScroll(e: WheelEvent) {
    e.preventDefault();
    if (e.deltaY === 0) {
      return;
    }
    scrollContainerRef.scrollLeft += e.deltaY;
  }

  return (
    <HStack
      ref={scrollContainerRef}
      gap="2"
      py="1"
      px="2"
      minWidth="0"
      overflow="auto"
      onWheel={hanedleHorizontalScroll}
    >
      <For each={characterIds()}>{(id) => <CharacterItem id={id} />}</For>
    </HStack>
  );
};
