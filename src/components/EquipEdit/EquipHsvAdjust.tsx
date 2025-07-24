import { Show, createMemo } from 'solid-js';
import { css } from 'styled-system/css';
import { useTranslate } from '@/context/i18n';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

import {
  updateItemHsvInfo,
  batchUpdateItemHsvInfo,
  resetItemHsvInfo,
} from '@/store/character/action';
import { createGetItemChangeById } from '@/store/character/selector';
import { getCharacterSubCategory } from '@/store/character/utils';
import { $equipmentDrawerSyncSkinChange } from '@/store/trigger';
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

export interface EquipHsvAdjustProps {
  id: number;
  hasRandom?: boolean;
}
export const EquipHsvAdjust = (props: EquipHsvAdjustProps) => {
  const t = useTranslate();
  const getItemChangeById = createMemo(() => createGetItemChangeById(props.id));
  const itemChange = useDynamicPureStore(getItemChangeById);

  const createItemChange =
    (property: 'colorRange' | 'hue' | 'saturation' | 'brightness' | 'alpha') =>
    (value: number) => {
      const category = itemChange()?.category;
      if (!category) {
        return;
      }

      if (
        $equipmentDrawerSyncSkinChange.get() &&
        (category === 'Head' || category === 'Body')
      ) {
        updateItemHsvInfo('Head', property, value);
        updateItemHsvInfo('Body', property, value);
        return;
      }

      updateItemHsvInfo(getCharacterSubCategory(category), property, value);
    };

  function handleResetAll() {
    const category = itemChange()?.category;
    // if (category === 'Head') {
    //   resetItemHsvInfo('Head');
    //   resetItemHsvInfo('Body');
    // } else
    if (category) {
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
    // if (category === 'Head') {
    //   batchUpdateItemHsvInfo('Head', data);
    //   batchUpdateItemHsvInfo('Body', data);
    // } else

    if (category) {
      const subCategory = getCharacterSubCategory(category);
      batchUpdateItemHsvInfo(subCategory, data);
    }
  }
  const handleColorRangeChange = createItemChange('colorRange');
  const handleHueChange = createItemChange('hue');
  const handleSaturationChange = createItemChange('saturation');
  const handleBrightnessChange = createItemChange('brightness');
  const handleAlphaChange = createItemChange('alpha');

  const colorOptions = useLocalizedOptions([
    {
      label: 'dye.colorRangeAll',
      value: ColorRange.All,
    },
    {
      label: 'dye.colorRangeRed',
      value: ColorRange.Red,
    },
    {
      label: 'dye.colorRangeYellow',
      value: ColorRange.Yellow,
    },
    {
      label: 'dye.colorRangeGreen',
      value: ColorRange.Green,
    },
    {
      label: 'dye.colorRangeCyan',
      value: ColorRange.Cyan,
    },
    {
      label: 'dye.colorRangeBlue',
      value: ColorRange.Blue,
    },
    {
      label: 'dye.colorRangePurple',
      value: ColorRange.Purple,
    },
  ]);

  const alphaBackgroundProperty =
    'linear-gradient(90deg, transparent, #fff), conic-gradient(white 90deg, #999 90deg, #999 180deg, white 180deg, white 270deg, #999 270deg, #999 360deg, white 360deg) 0% 0% / 8px 8px repeat';

  return (
    <Show when={itemChange()}>
      <VStack pt={1}>
        <HStack w="full" alignItems="center">
          <Button variant="outline" size="sm" onClick={handleResetAll}>
            <ResetIcon />
            {t('common.reset')}
          </Button>
          <Select
            width="[40%]"
            placeholder={t('dye.colorRange')}
            items={colorOptions()}
            positioning={{ sameWidth: true }}
            size="sm"
            value={[(itemChange()?.item.colorRange || 0).toString()]}
            onValueChange={(detail) => {
              handleColorRangeChange(Number(detail.value[0]));
            }}
          />
          <Show when={props.hasRandom}>
            <IconButton
              marginLeft="auto"
              variant="outline"
              size="sm"
              onClick={handleRandomAll}
              title={t('dye.randomPrism')}
            >
              <RandomLineIcon />
            </IconButton>
          </Show>
        </HStack>
        <VStack gap="0.5" w="full">
          <EquipHsvSlider
            title={t('dye.hue')}
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
            title={t('dye.saturation')}
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
            title={t('dye.brightness')}
            property="brightness"
            value={itemChange()?.item.brightness || 0}
            onValueChange={handleBrightnessChange}
            class={css({
              '--ui-slider-track-background': 'gradients.brightness',
              '--ui-slider-range-background': 'transparent',
              w: 'full',
            })}
          />
          <EquipHsvSlider
            title={t('dye.alpha')}
            property="alpha"
            value={itemChange()?.item.alpha ?? 100}
            onValueChange={handleAlphaChange}
            class={css({
              '--ui-slider-track-background': alphaBackgroundProperty,
              '--ui-slider-range-background': 'transparent',
              w: 'full',
            })}
          />
        </VStack>
      </VStack>
    </Show>
  );
};

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
