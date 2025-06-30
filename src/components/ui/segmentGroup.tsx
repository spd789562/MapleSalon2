import { type JSX, Index, splitProps } from 'solid-js';
import type { Assign } from '@ark-ui/solid';
import { SegmentGroup } from '@ark-ui/solid/segment-group';
import {
  type SegmentGroupVariantProps,
  segmentGroup,
} from 'styled-system/recipes/segment-group';
import type { JsxStyleProps } from 'styled-system/types';
import { createStyleContext } from '@/utils/create-style-context';

const { withProvider, withContext } = createStyleContext(segmentGroup);

export interface RootProps
  extends Assign<JsxStyleProps, SegmentGroup.RootProps>,
    SegmentGroupVariantProps {}
export const Root = withProvider<RootProps>(SegmentGroup.Root, 'root');

export const Indicator = withContext<
  Assign<JsxStyleProps, SegmentGroup.IndicatorProps>
>(SegmentGroup.Indicator, 'indicator');

export const ItemControl = withContext<
  Assign<JsxStyleProps, SegmentGroup.ItemControlProps>
>(SegmentGroup.ItemControl, 'itemControl');

export const Item = withContext<Assign<JsxStyleProps, SegmentGroup.ItemProps>>(
  SegmentGroup.Item,
  'item',
);

export const ItemText = withContext<
  Assign<JsxStyleProps, SegmentGroup.ItemTextProps>
>(SegmentGroup.ItemText, 'itemText');

export const Label = withContext<
  Assign<JsxStyleProps, SegmentGroup.LabelProps>
>(SegmentGroup.Label, 'label');

export const ItemHiddenInput = SegmentGroup.ItemHiddenInput;

export {
  SegmentGroupContext as Context,
  type SegmentGroupContextProps as ContextProps,
  type SegmentGroupValueChangeDetails as ValueChangeDetails,
} from '@ark-ui/solid/segment-group';

export interface SimpleSegmentGroupProps<T extends string> extends RootProps {
  options: {
    label: JSX.Element;
    value: T;
    disabled?: boolean;
    title?: string;
  }[];
}
export const SimpleSegmentGroup = <T extends string>(
  props: SimpleSegmentGroupProps<T>,
) => {
  const [localProps, toggleGroupProps] = splitProps(props, ['options']);

  return (
    <Root {...toggleGroupProps}>
      <Index each={localProps.options}>
        {(option) => (
          <Item
            value={option().value}
            disabled={option().disabled}
            title={option().title}
          >
            <ItemText>{option().label}</ItemText>
            <ItemControl />
            <ItemHiddenInput />
          </Item>
        )}
      </Index>
      <Indicator />
    </Root>
  );
};
