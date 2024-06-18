import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $currentItem } from '@/store/character';

import { Box } from 'styled-system/jsx/box';
import { EquipTitle } from './EquipTitle';
import { EquipHsvAdjust } from './EquipHsvAdjust';

export const EquipEdit = () => {
  const item = useStore($currentItem);

  return (
    <Box h="48">
      <Show when={item()}>
        {(item) => (
          <>
            <EquipTitle id={item().id} name={item().name} />
            <EquipHsvAdjust id={item().id} />
          </>
        )}
      </Show>
    </Box>
  );
};
