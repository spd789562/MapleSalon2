import type { Assign } from '@ark-ui/solid';
import { Progress } from '@ark-ui/solid/progress';
import { type ComponentProps, splitProps, children, Show } from 'solid-js';
import {
  type ProgressVariantProps,
  progress,
} from 'styled-system/recipes/progress';
import type { HTMLStyledProps } from 'styled-system/types';
import { createStyleContext } from '@/utils/create-style-context';

const { withProvider, withContext } = createStyleContext(progress);

export type RootProviderProps = ComponentProps<typeof RootProvider>;
export const RootProvider = withProvider<
  Assign<
    Assign<HTMLStyledProps<'div'>, Progress.RootProviderBaseProps>,
    ProgressVariantProps
  >
>(Progress.RootProvider, 'root');

export type RootProps = ComponentProps<typeof Root>;
export const Root = withProvider<
  Assign<
    Assign<HTMLStyledProps<'div'>, Progress.RootBaseProps>,
    ProgressVariantProps
  >
>(Progress.Root, 'root');

export const Circle = withContext<
  Assign<HTMLStyledProps<'svg'>, Progress.CircleBaseProps>
>(Progress.Circle, 'circle');

export const CircleRange = withContext<
  Assign<HTMLStyledProps<'circle'>, Progress.CircleRangeBaseProps>
>(Progress.CircleRange, 'circleRange');

export const CircleTrack = withContext<
  Assign<HTMLStyledProps<'circle'>, Progress.CircleTrackBaseProps>
>(Progress.CircleTrack, 'circleTrack');

export const Label = withContext<
  Assign<HTMLStyledProps<'label'>, Progress.LabelBaseProps>
>(Progress.Label, 'label');

export const Range = withContext<
  Assign<HTMLStyledProps<'div'>, Progress.RangeBaseProps>
>(Progress.Range, 'range');

export const Track = withContext<
  Assign<HTMLStyledProps<'div'>, Progress.TrackBaseProps>
>(Progress.Track, 'track');

export const ValueText = withContext<
  Assign<HTMLStyledProps<'span'>, Progress.ValueTextBaseProps>
>(Progress.ValueText, 'valueText');

export const View = withContext<
  Assign<HTMLStyledProps<'span'>, Progress.ViewBaseProps>
>(Progress.View, 'view');

export { ProgressContext as Context } from '@ark-ui/solid/progress';

export interface LineProgressProps extends RootProps {}
export const LineProgress = (props: LineProgressProps) => {
  const [localProps, rootProps] = splitProps(props, ['children']);
  const getChildren = children(() => localProps.children);

  return (
    <Root {...rootProps}>
      <Show when={getChildren()}>
        <Label>{getChildren()}</Label>
      </Show>
      <Track>
        <Range />
      </Track>
      <ValueText />
    </Root>
  );
};

export interface CircleProgressProps extends RootProps {}
export const CircleProgress = (props: CircleProgressProps) => {
  const [localProps, rootProps] = splitProps(props, ['children']);
  const getChildren = children(() => localProps.children);

  return (
    <Root {...rootProps}>
      <Show when={getChildren()}>
        <Label>{getChildren()}</Label>
      </Show>
      <Circle>
        <CircleTrack />
        <CircleRange />
      </Circle>
      <ValueText />
    </Root>
  );
};
