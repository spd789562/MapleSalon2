import { Show, createMemo } from 'solid-js';
import { css } from 'styled-system/css';

import {
  updateItemHsvInfo,
  batchUpdateItemHsvInfo,
  resetItemHsvInfo,
} from '@/store/character/action';
import { createGetItemChangeById } from '@/store/character/selector';
import { getCharacterSubCategory } from '@/store/character/utils';
import { useDynamicPureStore } from '@/store';

import ResetIcon from 'lucide-solid/icons/rotate-ccw';
import RandomLineIcon from 'mingcute_icon/svg/other/random_line.svg';
import { VStack } from 'styled-system/jsx/vstack';
import { HStack } from 'styled-system/jsx/hstack';
import { SimpleSelect as Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { EquipHsvSlider } from './EquipHsvSlider';

import { ColorRange } from '@/renderer/filter/hsvAdjustmentFilter';

const ColorOtions = [
  {
    label: '整體色系',
    value: ColorRange.All,
  },
  {
    label: '紅色系',
    value: ColorRange.Red,
  },
  {
    label: '黃色系',
    value: ColorRange.Yellow,
  },
  {
    label: '綠色系',
    value: ColorRange.Green,
  },
  {
    label: '青綠色系',
    value: ColorRange.Cyan,
  },
  {
    label: '藍色系',
    value: ColorRange.Blue,
  },
  {
    label: '紫色系',
    value: ColorRange.Purple,
  },
];

export interface EquipHsvAdjustProps {
  id: number;
}
export const EquipHsvAdjust = (props: EquipHsvAdjustProps) => {
  const getItemChangeById = createMemo(() => createGetItemChangeById(props.id));
  const itemChange = useDynamicPureStore(getItemChangeById);

  const createItemChange =
    (property: 'colorRange' | 'hue' | 'saturation' | 'brightness') =>
    (value: number) => {
      const category = itemChange()?.category;
      if (category === 'Head') {
        updateItemHsvInfo('Head', property, value);
        updateItemHsvInfo('Body', property, value);
      } else if (category) {
        updateItemHsvInfo(getCharacterSubCategory(category), property, value);
      }
    };

  function handleResetAll() {
    const category = itemChange()?.category;
    if (category === 'Head') {
      resetItemHsvInfo('Head');
      resetItemHsvInfo('Body');
    } else if (category) {
      const subCategory = getCharacterSubCategory(category);
      resetItemHsvInfo(subCategory);
    }
  }
  function handleRandomAll() {
    const category = itemChange()?.category;
    const data = {
      hue: getRandomNumber(0, 360),
      saturation: getRandomNumber(-100, 100),
      brightness: getRandomNumber(-100, 100),
    };
    if (category === 'Head') {
      batchUpdateItemHsvInfo('Head', data);
      batchUpdateItemHsvInfo('Body', data);
    } else if (category) {
      const subCategory = getCharacterSubCategory(category);
      batchUpdateItemHsvInfo(subCategory, data);
    }
  }
  const handleColorRangeChange = createItemChange('colorRange');
  const handleHueChange = createItemChange('hue');
  const handleSaturationChange = createItemChange('saturation');
  const handleBrightnessChange = createItemChange('brightness');

  return (
    <Show when={itemChange()}>
      <VStack pt={1}>
        <HStack w="full" alignItems="center">
          <Button variant="outline" size="sm" onClick={handleResetAll}>
            <ResetIcon />
            重置
          </Button>
          <Select
            width="[40%]"
            placeholder="染色區間"
            items={ColorOtions}
            positioning={{ sameWidth: true }}
            size="sm"
            value={[(itemChange()?.item.colorRange || 0) as unknown as string]}
            onValueChange={(detail) => {
              handleColorRangeChange(Number(detail.value[0]));
            }}
          />
          <IconButton
            marginLeft="auto"
            variant="outline"
            size="sm"
            onClick={handleRandomAll}
            title="隨機染色"
          >
            <RandomLineIcon />
          </IconButton>
        </HStack>
        <EquipHsvSlider
          title="色相"
          property="hue"
          value={itemChange()?.item.hue || 0}
          onValueChange={handleHueChange}
          class={css({
            '--ui-slider-track-background': 'gradients.hue',
            '--ui-slider-range-background': 'trasparent',
            w: 'full',
          })}
        />
        <EquipHsvSlider
          title="飽和度"
          property="saturation"
          value={itemChange()?.item.saturation || 0}
          onValueChange={handleSaturationChange}
          class={css({
            '--ui-slider-track-background': 'gradients.saturation',
            '--ui-slider-range-background': 'transparent',
            w: 'full',
          })}
        />
        <EquipHsvSlider
          title="亮度"
          property="brightness"
          value={itemChange()?.item.brightness || 0}
          onValueChange={handleBrightnessChange}
          class={css({
            '--ui-slider-track-background': 'gradients.brightness',
            '--ui-slider-range-background': 'transparent',
            w: 'full',
          })}
        />
      </VStack>
    </Show>
  );
};

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
