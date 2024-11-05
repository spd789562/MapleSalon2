import { For } from 'solid-js';

import { usePureStore } from '@/store';

import {
  $getCharacterIds,
  selectCharacter,
  type SaveCharacterData,
} from '@/store/characterDrawer';
import { getHasAnyChanges } from '@/store/character/selector';
import { openDialog, DialogType } from '@/store/confirmDialog';

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

  function handleSelect(data: SaveCharacterData) {
    const hasChanges = getHasAnyChanges();
    if (hasChanges) {
      /* do something like popup */
      openDialog({
        type: DialogType.Confirm,
        title: '確認捨棄變更',
        description: '當前變更尚未儲存，是否捨棄變更？',
        confirmButton: {
          text: '捨棄變更',
          onClick: () => selectCharacter(data),
        },
      });
    } else {
      selectCharacter(data);
    }
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
      <For each={characterIds()}>
        {(id) => <CharacterItem id={id} onSelect={handleSelect} />}
      </For>
    </HStack>
  );
};
