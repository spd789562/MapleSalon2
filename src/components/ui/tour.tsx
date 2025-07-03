import type { ComponentProps } from 'solid-js';
import { Portal, For } from 'solid-js/web';
import type { Assign } from '@ark-ui/solid';
import { Tour, type TourStepDetails } from '@ark-ui/solid/tour';
import { type TourVariantProps, tour } from 'styled-system/recipes/tour';
import type { HTMLStyledProps } from 'styled-system/types';
import { createStyleContext } from '@/utils/create-style-context';

import CloseIcon from 'lucide-solid/icons/x';
import { Stack } from 'styled-system/jsx/stack';
import { IconButton } from './icon-button';
import { Button } from './button';

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

export type TourStepAction = Required<TourStepDetails>['actions'][number];

export {
  type TourContextProps as ContextProps,
  TourContext as Context,
  TourActions as Actions,
  type TourStepDetails,
  useTour,
} from '@ark-ui/solid/tour';

export interface SimpleTourProps extends RootProps {}
export function SimpleTour(props: SimpleTourProps) {
  return (
    <Root {...props}>
      <Portal>
        <Backdrop />
        <Spotlight />
        <Positioner>
          <Content>
            <Arrow>
              <ArrowTip />
            </Arrow>
            <Stack gap="6">
              <Stack gap="1">
                <ProgressText />
                <Title />
                <Description />
              </Stack>
              <Control>
                <Tour.Actions>
                  {(actions) => (
                    <For each={actions()}>
                      {(action) => (
                        <ActionTrigger
                          action={action}
                          asChild={(props) => (
                            <Button
                              size="sm"
                              variant={
                                action.action === 'prev' ? 'outline' : 'solid'
                              }
                              {...props()}
                            >
                              {action.label}
                            </Button>
                          )}
                        />
                      )}
                    </For>
                  )}
                </Tour.Actions>
              </Control>
            </Stack>
            <CloseTrigger
              asChild={(props) => (
                <IconButton size="sm" variant="link" {...props()}>
                  <CloseIcon />
                </IconButton>
              )}
            />
          </Content>
        </Positioner>
      </Portal>
    </Root>
  );
}
