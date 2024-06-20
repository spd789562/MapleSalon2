import { type Assign, RadioGroup } from '@ark-ui/solid';
import {
  type RadioButtonGroupVariantProps,
  radioButtonGroup,
} from 'styled-system/recipes/radio-button-group';
import type { JsxStyleProps } from 'styled-system/types';
import { createStyleContext } from '@/utils/create-style-context';

const { withProvider, withContext } = createStyleContext(radioButtonGroup);

export interface RootProps
  extends Assign<JsxStyleProps, RadioGroup.RootProps>,
    RadioButtonGroupVariantProps {}
export const Root = withProvider<RootProps>(RadioGroup.Root, 'root');

export const Indicator = withContext<
  Assign<JsxStyleProps, RadioGroup.IndicatorProps>
>(RadioGroup.Indicator, 'indicator');

export const ItemControl = withContext<
  Assign<JsxStyleProps, RadioGroup.ItemControlProps>
>(RadioGroup.ItemControl, 'itemControl');

export const Item = withContext<Assign<JsxStyleProps, RadioGroup.ItemProps>>(
  RadioGroup.Item,
  'item',
);

export const ItemText = withContext<
  Assign<JsxStyleProps, RadioGroup.ItemTextProps>
>(RadioGroup.ItemText, 'itemText');

export const Label = withContext<Assign<JsxStyleProps, RadioGroup.LabelProps>>(
  RadioGroup.Label,
  'label',
);

export const ItemHiddenInput = RadioGroup.ItemHiddenInput;

export {
  RadioGroupContext as Context,
  type RadioGroupContextProps as ContextProps,
  type RadioGroupValueChangeDetails as ValueChangeDetails,
} from '@ark-ui/solid';
