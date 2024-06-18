import { Show, createMemo } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { css } from 'styled-system/css';

import {
  createGetItemChangeById,
  $currentItemChanges,
} from '@/store/character';

import { Slider } from '@/components/ui/slider';

export interface EquipHsvAdjustProps {
  id: number;
}
export const EquipHsvAdjust = (props: EquipHsvAdjustProps) => {
  const getItemChangeById = createMemo(() => createGetItemChangeById(props.id));
  const itemChange = useStore(getItemChangeById());

  const createItemChange =
    (property: 'hue' | 'saturation' | 'brightness') => (value: number) => {
      const category = itemChange()?.category;
      if (category) {
        $currentItemChanges.setKey(`${category}.${property}`, value);
      }
    };

  const handleHueChange = createItemChange('hue');
  const handleSaturationChange = createItemChange('saturation');
  const handleBrightnessChange = createItemChange('brightness');

  return (
    <Show when={itemChange()}>
      <div>
        <label for="hue">Hue:</label>
        <Slider
          id="hue"
          min={0}
          max={360}
          step={1}
          value={[itemChange()?.item.hue || 0]}
          onValueChange={(e) => handleHueChange(e.value[0])}
          class={css({
            '--ui-slider-track-background':
              'linear-gradient(90deg, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
            '--ui-slider-range-background': 'trasparent',
          })}
        />
      </div>
      <div>
        <label for="saturation">Saturation:</label>
        <Slider
          id="saturation"
          min={-100}
          max={100}
          step={1}
          value={[itemChange()?.item.saturation || 0]}
          onValueChange={(e) => handleSaturationChange(e.value[0])}
          class={css({
            '--ui-slider-track-background':
              'linear-gradient(90deg, #999, #f00)',
            '--ui-slider-range-background': 'transparent',
          })}
        />
      </div>
      <div>
        <label for="brightness">Brightness:</label>
        <Slider
          id="brightness"
          min={-100}
          max={100}
          step={1}
          value={[itemChange()?.item.brightness || 0]}
          onValueChange={(e) => handleBrightnessChange(e.value[0])}
          class={css({
            '--ui-slider-track-background':
              'linear-gradient(90deg, #000000, #ffffff)',
            '--ui-slider-range-background': 'transparent',
          })}
        />
      </div>
    </Show>
  );
};
