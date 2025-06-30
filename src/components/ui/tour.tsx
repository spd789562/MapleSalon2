import type { ComponentProps } from 'solid-js';
import type { Assign } from '@ark-ui/solid';
import { Tour } from '@ark-ui/solid/tour';
import { type TourVariantProps, tour } from 'styled-system/recipes';
import type { HTMLStyledProps } from 'styled-system/types';
import { createStyleContext } from '@/utils/create-style-context';

const { withRootProvider, withContext } = createStyleContext(tour);

export type RootProps = ComponentProps<typeof Root>;
export const Root = withRootProvider<Assign<Tour.RootProps, TourVariantProps>>(
  Tour.Root,
);

export const Backdrop = withContext<
  Assign<HTMLStyledProps<'div'>, Tour.BackdropBaseProps>
>(Tour.Backdrop, 'backdrop');

export const Spotlight = withContext<
  Assign<HTMLStyledProps<'div'>, Tour.SpotlightBaseProps>
>(Tour.Spotlight, 'spotlight');

export const CloseTrigger = withContext<
  Assign<HTMLStyledProps<'button'>, Tour.CloseTriggerBaseProps>
>(Tour.CloseTrigger, 'closeTrigger');

export const Content = withContext<
  Assign<HTMLStyledProps<'div'>, Tour.ContentBaseProps>
>(Tour.Content, 'content');

export const Description = withContext<
  Assign<HTMLStyledProps<'div'>, Tour.DescriptionBaseProps>
>(Tour.Description, 'description');

export const Positioner = withContext<
  Assign<HTMLStyledProps<'div'>, Tour.PositionerBaseProps>
>(Tour.Positioner, 'positioner');

export const Title = withContext<
  Assign<HTMLStyledProps<'h2'>, Tour.TitleBaseProps>
>(Tour.Title, 'title');

export const Arrow = withContext<
  Assign<HTMLStyledProps<'div'>, Tour.ArrowBaseProps>
>(Tour.Arrow, 'arrow');

export const ArrowTip = withContext<
  Assign<HTMLStyledProps<'div'>, Tour.ArrowTipBaseProps>
>(Tour.ArrowTip, 'arrowTip');

export const ProgressText = withContext<
  Assign<HTMLStyledProps<'div'>, Tour.ProgressTextBaseProps>
>(Tour.ProgressText, 'progressText');

export const ActionTrigger = withContext<
  Assign<HTMLStyledProps<'button'>, Tour.ActionTriggerBaseProps>
>(Tour.ActionTrigger, 'actionTrigger');

export const Control = withContext<
  Assign<HTMLStyledProps<'div'>, Tour.ControlBaseProps>
>(Tour.Control, 'control');

export const Context = Tour.Context;
export const Actions = Tour.Actions;

export {
  type TourContextProps as ContextProps,
  TourContext,
  TourActions,
  type TourStepDetails,
} from '@ark-ui/solid/tour';
