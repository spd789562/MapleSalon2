import { For } from 'solid-js';
import { useTranslate } from '@/context/i18n';
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
  const t = useTranslate();
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
      openDialog({
        type: DialogType.Confirm,
        title: t('setting.abandonCharacterChangesTitle'),
        description: t('setting.abandonCharacterChangesDesc'),
        confirmButton: {
          text: t('setting.abandonCharacterChanges'),
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
