import { type JSX, Index, splitProps } from 'solid-js';
import { type Assign, SegmentGroup, SegmentGroupContext } from '@ark-ui/solid';
import {
  type ToggleGroupVariantProps,
  toggleGroup,
} from 'styled-system/recipes/toggle-group';
import type { JsxStyleProps } from 'styled-system/types';
import { createStyleContext } from '@/utils/create-style-context';

import { HStack } from 'styled-system/jsx/hstack';

/* using toggleGroup recipes but use SegmentGroup as base component, 
  cuz the ToggleGroup is cancelable and it can't be disabled */
const { withProvider, withContext } = createStyleContext(toggleGroup);

export interface RootProps
  extends Assign<JsxStyleProps, SegmentGroup.RootProps>,
    ToggleGroupVariantProps {}
export const Root = withProvider<RootProps>(SegmentGroup.Root, 'root');

export type ItemProps = Assign<JsxStyleProps, SegmentGroup.ItemProps>;
export const Item = withContext<ItemProps>(SegmentGroup.Item, 'item');

export {
  SegmentGroupContext as Context,
  type SegmentGroupContextProps as ContextProps,
  type SegmentGroupValueChangeDetails as ValueChangeDetails,
} from '@ark-ui/solid';

export interface SimpleToggleGroupProps<T extends string> extends RootProps {
  options: {
    label: JSX.Element;
    value: T;
    disabled?: boolean;
    title?: string;
  }[];
}
export const SimpleToggleGroup = <T extends string>(
  props: SimpleToggleGroupProps<T>,
) => {
  const [localProps, toggleGroupProps] = splitProps(props, ['options']);

  return (
    <Root {...toggleGroupProps}>
      <HStack>
        <Index each={localProps.options}>
          {(item) => (
            <SegmentGroupContext>
              {(api) => (
                <Item
                  value={item().value}
                  disabled={item().disabled}
                  title={item().title}
                  px={2}
                  data-state={item().value === api().value ? 'on' : 'off'}
                >
                  {item().label}
                  <SegmentGroup.ItemHiddenInput />
                </Item>
              )}
            </SegmentGroupContext>
          )}
        </Index>
      </HStack>
    </Root>
  );
};
