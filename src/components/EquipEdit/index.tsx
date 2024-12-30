import { Show, Switch, Match, createMemo } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { $equpimentDrawerEditType } from '@/store/trigger';
import { $currentItem } from '@/store/character/store';
import { getEquipById } from '@/store/string';

import { Box } from 'styled-system/jsx/box';
import { EquipTitle } from './EquipTitle';
import { EquipTags } from './EquipTags';
import { EquipHsvAdjust } from './EquipHsvAdjust';
import { MixDyeAdjust } from './MixDyeAdjust';
import { EditTypeToggleGroup } from './EditTypeToggleGroup';

import { getSubCategory } from '@/utils/itemId';

export const EquipEdit = () => {
  const editType = useStore($equpimentDrawerEditType);
  const item = useStore($currentItem);

  const itemInfo = createMemo(() => {
    const id = item()?.id;
    return id ? getEquipById(id) : undefined;
  });

  const isHair = createMemo(() => {
    const i = item();
    return i && getSubCategory(i.id) === 'Hair';
  });

  const isFace = createMemo(() => {
    const i = item();
    return i && getSubCategory(i.id) === 'Face';
  });

  const isHairOrFace = () => isHair() || isFace();

  return (
    <Box h="13.5rem" position="relative">
      <Show when={item()}>
        {(item) => (
          <>
            <EquipTitle
              id={item().id}
              name={itemInfo()?.name ?? item().name}
              tags={<EquipTags info={itemInfo()} />}
            />
            <Switch
              fallback={
                <EquipHsvAdjust id={item().id} hasRandom={!isHairOrFace()} />
              }
            >
              <Match when={isHair() && editType() === 'mixDye'}>
                <MixDyeAdjust id={item().id} category="Hair" />
              </Match>
              <Match when={isFace() && editType() === 'mixDye'}>
                <MixDyeAdjust id={item().id} category="Face" />
              </Match>
            </Switch>
          </>
        )}
      </Show>
      <Show when={isHairOrFace()}>
        <EditTypePositioner>
          <EditTypeToggleGroup />
        </EditTypePositioner>
      </Show>
    </Box>
  );
};

const EditTypePositioner = styled('div', {
  base: {
    position: 'absolute',
    top: 7,
    right: 0,
  },
});
