import { Show, createMemo } from 'solid-js';
import { css } from 'styled-system/css';

import { $currentItem, $currentItemChanges } from '@/store/character/store';
import { createGetItemChangeById } from '@/store/character/selector';
import { getEquipById } from '@/store/string';
import { useDynamicPureStore } from '@/store';

import { Box } from 'styled-system/jsx/box';
import { HStack } from 'styled-system/jsx/hstack';
import { VStack } from 'styled-system/jsx/vstack';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import {
  MixDyeColorSelection,
  generateHairColorOptions,
  generateFaceColorOptions,
} from './MixDyeColorSelection';
import { MixDyeAlphaSlider } from './MixDyeAlphaSlider';

import {
  formatHairId,
  formatFaceId,
  getHairColorId,
  changeHairColorId,
  changeFaceColorId,
  getFaceColorId,
} from '@/utils/mixDye';
import type { HairColorId } from '@/const/hair';
import type { FaceColorId } from '@/const/face';

export interface MixDyeAdjustProps {
  id: number;
  category: 'Hair' | 'Face';
}
export const MixDyeAdjust = (props: MixDyeAdjustProps) => {
  const getItemChangeById = createMemo(() => {
    return createGetItemChangeById(props.id);
  });
  const itemChange = useDynamicPureStore(getItemChangeById);
  const genericId = createMemo(() =>
    props.category === 'Hair' ? formatHairId(props.id) : formatFaceId(props.id),
  );

  const options = createMemo(() => {
    return props.category === 'Hair'
      ? generateHairColorOptions(genericId())
      : generateFaceColorOptions(genericId());
  });

  const isEnableDye = createMemo(() =>
    itemChange()?.item.isDeleteDye ? false : !!itemChange()?.item.dye,
  );

  function getColorId(id: number) {
    return props.category === 'Hair' ? getHairColorId(id) : getFaceColorId(id);
  }

  function getMixDyeId(id: number, colorId: number) {
    return props.category === 'Hair'
      ? changeHairColorId(id, colorId as HairColorId)
      : changeFaceColorId(id, colorId as FaceColorId);
  }

  function getColor(id: number) {
    return (
      options().find((option) => option.color === id)?.colorHex || 'transparent'
    );
  }

  const baseColor = createMemo(() => getColor(props.id));
  const rangeColor = createMemo(() =>
    getColor(getMixDyeId(props.id, itemChange()?.item?.dye?.color || 0)),
  );

  function handleToggleMixDye(details: ChangeDetails) {
    if (details.checked) {
      $currentItemChanges.setKey(`${props.category}.isDeleteDye`, false);
      if (!itemChange()?.item.dye) {
        handleMixDyeColorChange(0);
      }
    } else {
      $currentItemChanges.setKey(`${props.category}.isDeleteDye`, true);
    }
  }

  function handleColorChange(value: number) {
    const equipInfo = getEquipById(value);
    $currentItemChanges.setKey(`${props.category}.id`, value);
    const name = equipInfo?.name || value.toString();
    $currentItemChanges.setKey(`${props.category}.name`, name);
    $currentItem.set({
      id: value,
      name: name,
    });
  }

  function handleMixDyeColorChange(value: number) {
    const currentItemChange = itemChange()?.item;
    $currentItemChanges.setKey(`${props.category}.dye`, {
      color: getColorId(value),
      alpha: currentItemChange?.dye?.alpha || 50,
    });
  }

  function handleMixDyeAlphaChange(value: number) {
    const currentItemChange = itemChange()?.item;
    if (currentItemChange?.dye) {
      $currentItemChanges.setKey(`${props.category}.dye.alpha`, value);
    }
  }

  return (
    <Show when={itemChange()}>
      {(item) => (
        <VStack pt={1} gap={1}>
          <Box alignSelf="flex-start" ml={2}>
            顏色
          </Box>
          <MixDyeColorSelection
            value={item().item.id?.toString()}
            onChange={handleColorChange}
            options={options()}
          />
          <HStack alignSelf="flex-start" alignItems="center" ml={2}>
            混染
            <Switch
              checked={isEnableDye()}
              onCheckedChange={handleToggleMixDye}
              alignSelf="flex-start"
              ml={2}
            />
          </HStack>
          <MixDyeColorSelection
            value={getMixDyeId(
              props.id,
              item().item.dye?.color || 0,
            ).toString()}
            onChange={handleMixDyeColorChange}
            options={options()}
            disabled={!isEnableDye()}
          />
          <MixDyeAlphaSlider
            title="混染"
            value={item().item.dye?.alpha ?? 50}
            onValueChange={handleMixDyeAlphaChange}
            class={css({ width: 'full', mt: 1 })}
            baseColor={baseColor()}
            rangeColor={rangeColor()}
            disabled={!isEnableDye()}
          />
        </VStack>
      )}
    </Show>
  );
};
