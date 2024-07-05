import type { JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import { type Assign, Tooltip } from '@ark-ui/solid';
import {
  type TooltipVariantProps,
  tooltip,
} from 'styled-system/recipes/tooltip';
import type { JsxStyleProps } from 'styled-system/types';
import { createStyleContext } from '@/utils/create-style-context';

const { withRootProvider, withContext } = createStyleContext(tooltip);

export interface RootProps
  extends Assign<JsxStyleProps, Tooltip.RootProps>,
    TooltipVariantProps {}
export const Root = withRootProvider<RootProps>(Tooltip.Root);

export const Arrow = withContext<Assign<JsxStyleProps, Tooltip.ArrowProps>>(
  Tooltip.Arrow,
  'arrow',
);

export const ArrowTip = withContext<
  Assign<JsxStyleProps, Tooltip.ArrowTipProps>
>(Tooltip.ArrowTip, 'arrowTip');

export const Content = withContext<Assign<JsxStyleProps, Tooltip.ContentProps>>(
  Tooltip.Content,
  'content',
);

export const Positioner = withContext<
  Assign<JsxStyleProps, Tooltip.PositionerProps>
>(Tooltip.Positioner, 'positioner');

export const Trigger = withContext<Assign<JsxStyleProps, Tooltip.TriggerProps>>(
  Tooltip.Trigger,
  'trigger',
);

export {
  TooltipContext as Context,
  type TooltipContextProps as ContextProps,
} from '@ark-ui/solid';

export interface SimpleTooltipProps {
  children: JSX.Element;
  tooltip: string;
  zIndex?: number;
}
export const SimpleTooltip = (props: SimpleTooltipProps) => {
  return (
    <Root openDelay={100}>
      <Trigger>{props.children}</Trigger>
      <Portal>
        <Positioner style={{ 'z-index': props.zIndex || 1 }}>
          <Arrow>
            <ArrowTip />
          </Arrow>
          <Content>{props.tooltip}</Content>
        </Positioner>
      </Portal>
    </Root>
  );
};
