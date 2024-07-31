import { Show, Switch, Match, createMemo } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $currentItem } from '@/store/character/store';
import { getEquipById } from '@/store/string';

import { Box } from 'styled-system/jsx/box';
import { EquipTitle } from './EquipTitle';
import { EquipTags } from './EquipTags';
import { EquipHsvAdjust } from './EquipHsvAdjust';
import { MixDyeAdjust } from './MixDyeAdjust';

import { getSubCategory } from '@/utils/itemId';

export const EquipEdit = () => {
  const item = useStore($currentItem);

  const itemInfo = createMemo(() => {
    const id = item()?.id;
    return id ? getEquipById(id) : undefined;
  });

  return (
    <Box h="48">
      <Show when={item()}>
        {(item) => (
          <>
            <EquipTitle
              id={item().id}
              name={itemInfo()?.name ?? item().name}
              tags={<EquipTags info={itemInfo()} />}
            />
            <Switch fallback={<EquipHsvAdjust id={item().id} />}>
              <Match when={getSubCategory(item().id) === 'Hair'}>
                <MixDyeAdjust id={item().id} category="Hair" />
              </Match>
              <Match when={getSubCategory(item().id) === 'Face'}>
                <MixDyeAdjust id={item().id} category="Face" />
              </Match>
            </Switch>
          </>
        )}
      </Show>
    </Box>
  );
};
