import ResetIcon from 'lucide-solid/icons/rotate-ccw';
import { Grid } from 'styled-system/jsx/grid';
import { Slider } from '@/components/ui/slider';
import { NumberInput } from '@/components/ui/numberInput';
import { IconButton } from '@/components/ui/icon-button';

const ALPHA_MIN = 0;
const ALPHA_MAX = 100;

export interface MixDyeAlphaSliderProps {
  class?: string;
  title: string;
  value: number;
  onValueChange: (value: number) => void;
  baseColor: string;
  rangeColor: string;
}
export const MixDyeAlphaSlider = (props: MixDyeAlphaSliderProps) => {
  return (
    <div
      class={props.class}
      style={{
        '--ui-slider-track-background': props.baseColor,
        '--ui-slider-range-background': props.rangeColor,
      }}
    >
      <Grid gridTemplateColumns="auto 1fr 4.5rem" alignItems="center">
        <IconButton
          variant="outline"
          size="xs"
          title={`重製${props.title}`}
          onClick={() => props.onValueChange(50)}
        >
          <ResetIcon />
        </IconButton>
        <Slider
          id="mixDyeAlphaSlider"
          min={ALPHA_MIN}
          max={ALPHA_MAX}
          step={1}
          value={[props.value]}
          title={`${props.title}調整`}
          onValueChange={(e) => props.onValueChange(e.value[0])}
        />
        <NumberInput
          min={ALPHA_MIN}
          max={ALPHA_MAX}
          value={props.value.toString()}
          onValueChange={(e) => props.onValueChange(e.valueAsNumber)}
          allowOverflow={false}
        />
      </Grid>
    </div>
  );
};
