import { Show, createMemo } from 'solid-js';
import { css } from 'styled-system/css';

import {
  createGetItemChangeById,
  $currentItemChanges,
  getCharacterSubCategory,
} from '@/store/character';
import { useDynamicPureStore } from '@/store';

import { VStack } from 'styled-system/jsx/vstack';
import { EquipHsvSlider } from './EquipHsvSlider';

export interface EquipHsvAdjustProps {
  id: number;
}
export const EquipHsvAdjust = (props: EquipHsvAdjustProps) => {
  const getItemChangeById = createMemo(() => createGetItemChangeById(props.id));
  const itemChange = useDynamicPureStore(getItemChangeById);

  const createItemChange =
    (property: 'hue' | 'saturation' | 'brightness') => (value: number) => {
      const category = itemChange()?.category;
      if (category) {
        $currentItemChanges.setKey(
          `${getCharacterSubCategory(category)}.${property}`,
          value,
        );
      }
    };

  const handleHueChange = createItemChange('hue');
  const handleSaturationChange = createItemChange('saturation');
  const handleBrightnessChange = createItemChange('brightness');

  return (
    <Show when={itemChange()}>
      <VStack>
        <EquipHsvSlider
          property={/* @once */ 'hue'}
          value={itemChange()?.item.hue || 0}
          onValueChange={handleHueChange}
          class={css({
            '--ui-slider-track-background':
              'linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
            '--ui-slider-range-background': 'trasparent',
            w: 'full',
          })}
        />
        <EquipHsvSlider
          property={/* @once */ 'saturation'}
          value={itemChange()?.item.saturation || 0}
          onValueChange={handleSaturationChange}
          class={css({
            '--ui-slider-track-background':
              'linear-gradient(90deg, #999, #f00)',
            '--ui-slider-range-background': 'transparent',
            w: 'full',
          })}
        />
        <EquipHsvSlider
          property={/* @once */ 'brightness'}
          value={itemChange()?.item.brightness || 0}
          onValueChange={handleBrightnessChange}
          class={css({
            '--ui-slider-track-background':
              'linear-gradient(90deg, #000000, #ffffff)',
            '--ui-slider-range-background': 'transparent',
            w: 'full',
          })}
        />
      </VStack>
    </Show>
  );
};
