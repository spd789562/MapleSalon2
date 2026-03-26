import { createMemo } from 'solid-js';
import { css } from 'styled-system/css';
import { useTranslate } from '@/context/i18n';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

import { usePureStore } from '@/store';
import {
  $previewChairEffectHsv,
  $previewMountEffectHsv,
  $previewSkillEffectHsv,
  batchRandomPreviewEffectHsv,
  resetPreviewChairEffectHsv,
  resetPreviewMountEffectHsv,
  resetPreviewSkillEffectHsv,
  setPreviewChairEffectHsvField,
  setPreviewMountEffectHsvField,
  setPreviewSkillEffectHsvField,
} from '@/store/previewEffectHsv';

import ResetIcon from 'lucide-solid/icons/rotate-ccw';
import RandomLineIcon from 'mingcute_icon/svg/other/random_line.svg';
import { VStack } from 'styled-system/jsx/vstack';
import { HStack } from 'styled-system/jsx/hstack';
import { SimpleSelect as Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Text } from '@/components/ui/text';
import { EquipHsvSlider } from './EquipHsvSlider';

import { ColorRange } from '@/renderer/filter/hsvAdjustmentFilter';

export type PreviewEffectTarget = 'chair' | 'mount' | 'skill';

export interface PreviewEffectHsvAdjustProps {
  target: PreviewEffectTarget;
}

export const PreviewEffectHsvAdjust = (props: PreviewEffectHsvAdjustProps) => {
  const t = useTranslate();

  const chairHsv = usePureStore($previewChairEffectHsv);
  const mountHsv = usePureStore($previewMountEffectHsv);
  const skillHsv = usePureStore($previewSkillEffectHsv);

  const state = createMemo(() => {
    switch (props.target) {
      case 'chair':
        return chairHsv();
      case 'mount':
        return mountHsv();
      case 'skill':
        return skillHsv();
      default:
        return chairHsv();
    }
  });

  const setField = (
    field: 'colorRange' | 'hue' | 'saturation' | 'brightness' | 'alpha',
    value: number,
  ) => {
    if (props.target === 'chair') {
      setPreviewChairEffectHsvField(field, value);
    } else if (props.target === 'mount') {
      setPreviewMountEffectHsvField(field, value);
    } else {
      setPreviewSkillEffectHsvField(field, value);
    }
  };

  function handleResetAll() {
    if (props.target === 'chair') {
      resetPreviewChairEffectHsv();
    } else if (props.target === 'mount') {
      resetPreviewMountEffectHsv();
    } else {
      resetPreviewSkillEffectHsv();
    }
  }

  function handleRandomAll() {
    const data = {
      hue: getRandomNumber(0, 360),
      saturation: getRandomNumber(-100, 100),
      brightness: getRandomNumber(-100, 100),
    };
    batchRandomPreviewEffectHsv(props.target, data);
  }

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
    <VStack pt={1} gap={1} w="full" alignItems="stretch">
      <Text fontSize="sm" color="fg.muted"></Text>
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
          value={[state().colorRange.toString()]}
          onValueChange={(detail) => {
            setField('colorRange', Number(detail.value[0]));
          }}
        />
        <IconButton
          marginLeft="auto"
          variant="outline"
          size="sm"
          onClick={handleRandomAll}
          title={t('dye.randomPrism')}
        >
          <RandomLineIcon />
        </IconButton>
      </HStack>
      <VStack gap="0.5" w="full">
        <EquipHsvSlider
          title={t('dye.hue')}
          property="hue"
          value={state().hue}
          onValueChange={(v) => setField('hue', v)}
          class={css({
            '--ui-slider-track-background': 'gradients.hue',
            '--ui-slider-range-background': 'trasparent',
            w: 'full',
          })}
        />
        <EquipHsvSlider
          title={t('dye.saturation')}
          property="saturation"
          value={state().saturation}
          onValueChange={(v) => setField('saturation', v)}
          class={css({
            '--ui-slider-track-background': 'gradients.saturation',
            '--ui-slider-range-background': 'transparent',
            w: 'full',
          })}
        />
        <EquipHsvSlider
          title={t('dye.brightness')}
          property="brightness"
          value={state().brightness}
          onValueChange={(v) => setField('brightness', v)}
          class={css({
            '--ui-slider-track-background': 'gradients.brightness',
            '--ui-slider-range-background': 'transparent',
            w: 'full',
          })}
        />
        <EquipHsvSlider
          title={t('dye.alpha')}
          property="alpha"
          value={state().alpha}
          onValueChange={(v) => setField('alpha', v)}
          class={css({
            '--ui-slider-track-background': alphaBackgroundProperty,
            '--ui-slider-range-background': 'transparent',
            w: 'full',
          })}
        />
      </VStack>
    </VStack>
  );
};

function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
