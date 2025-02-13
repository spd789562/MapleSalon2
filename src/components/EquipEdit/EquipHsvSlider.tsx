import { useTranslate } from '@/context/i18n';

import ResetIcon from 'lucide-solid/icons/rotate-ccw';
import { Grid } from 'styled-system/jsx/grid';
import { Slider } from '@/components/ui/slider';
import { NumberInput } from '@/components/ui/numberInput';
import { IconButton } from '@/components/ui/icon-button';

const SliderProperyMap = {
  hue: {
    label: 'Hue',
    min: 0,
    max: 360,
    initial: 0,
    step: 1,
  },
  saturation: {
    label: 'Saturation',
    min: -100,
    max: 100,
    initial: 0,
    step: 1,
  },
  brightness: {
    label: 'Brightness',
    min: -100,
    max: 100,
    initial: 0,
    step: 1,
  },
  alpha: {
    label: 'Alpha',
    min: 0,
    max: 100,
    initial: 100,
    step: 1,
  },
};

export interface EquipHsvSliderProps {
  class?: string;
  title: string;
  property: 'hue' | 'saturation' | 'brightness' | 'alpha';
  value: number;
  onValueChange: (value: number) => void;
}
export const EquipHsvSlider = (props: EquipHsvSliderProps) => {
  const t = useTranslate();

  const propery = SliderProperyMap[props.property];

  return (
    <div class={props.class}>
      <Grid gridTemplateColumns="auto 1fr 4.5rem" alignItems="center">
        <IconButton
          variant="ghost"
          size="xs"
          title={`${t('common.reset')}${props.title}`}
          onClick={() => props.onValueChange(propery.initial)}
        >
          <ResetIcon />
        </IconButton>
        <Slider
          id={props.property}
          min={propery.min}
          max={propery.max}
          step={propery.step}
          value={[props.value]}
          title={`${props.title}${t('dye.adjust')}`}
          onValueChange={(e) => props.onValueChange(e.value[0])}
        />
        <NumberInput
          max={propery.max}
          min={propery.min}
          value={props.value.toString()}
          onValueChange={(e) => props.onValueChange(e.valueAsNumber)}
          allowOverflow={false}
        />
      </Grid>
    </div>
  );
};
