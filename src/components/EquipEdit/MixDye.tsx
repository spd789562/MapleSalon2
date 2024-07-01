import { Show, createMemo } from 'solid-js';
import { css } from 'styled-system/css';

import {
  createGetItemChangeById,
  $currentItemChanges,
  $currentItem,
} from '@/store/character';
import { getEquipById } from '@/store/string';
import { useDynamicPureStore } from '@/store';

import { VStack } from 'styled-system/jsx/vstack';
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
    if (currentItemChange?.dye) {
      $currentItemChanges.setKey(
        `${props.category}.dye.color`,
        getColorId(value),
      );
    } else {
      $currentItemChanges.setKey(`${props.category}.dye`, {
        color: getColorId(value),
        alpha: currentItemChange?.dye?.alpha || 50,
      });
    }
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
        <VStack pt={1}>
          <MixDyeColorSelection
            value={item().item.id.toString()}
            onChange={handleColorChange}
            options={options()}
          />
          <Show when={item().item.dye}>
            {(dyeInfo) => (
              <>
                <MixDyeColorSelection
                  value={getMixDyeId(props.id, dyeInfo().color).toString()}
                  onChange={handleMixDyeColorChange}
                  options={options()}
                />
                <MixDyeAlphaSlider
                  title="混染"
                  value={dyeInfo()?.alpha || 50}
                  onValueChange={handleMixDyeAlphaChange}
                  class={css({ width: 'full' })}
                  baseColor={baseColor()}
                  rangeColor={rangeColor()}
                />
              </>
            )}
          </Show>
        </VStack>
      )}
    </Show>
  );
};
