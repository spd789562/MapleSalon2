import { Show, Switch, Match } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $currentItem } from '@/store/character';

import { Box } from 'styled-system/jsx/box';
import { EquipTitle } from './EquipTitle';
import { EquipHsvAdjust } from './EquipHsvAdjust';

import { getSubCategory } from '@/utils/itemId';

export const EquipEdit = () => {
  const item = useStore($currentItem);

  return (
    <Box h="48">
      <Show when={item()}>
        {(item) => (
          <>
            <EquipTitle id={item().id} name={item().name} />
            <Switch fallback={<EquipHsvAdjust id={item().id} />}>
              <Match when={getSubCategory(item().id) === 'Hair'}>
                <div>1</div>
              </Match>
              <Match when={getSubCategory(item().id) === 'Face'}>
                <div>1</div>
              </Match>
            </Switch>
          </>
        )}
      </Show>
    </Box>
  );
};
