import type { Assign } from '@ark-ui/solid';
import { Checkbox, CheckboxHiddenInput } from '@ark-ui/solid/checkbox';
import { type ComponentProps, Show, children } from 'solid-js';
import {
  type CheckboxVariantProps,
  checkbox,
} from 'styled-system/recipes/checkbox';
import type { HTMLStyledProps } from 'styled-system/types';
import { createStyleContext } from '@/utils/create-style-context';
import CheckIcon from 'lucide-solid/icons/check';
import MinusIcon from 'lucide-solid/icons/minus';

const { withProvider, withContext } = createStyleContext(checkbox);

export type RootProviderProps = ComponentProps<typeof RootProvider>;
export const RootProvider = withProvider<
  Assign<
    Assign<HTMLStyledProps<'label'>, Checkbox.RootProviderBaseProps>,
    CheckboxVariantProps
  >
>(Checkbox.RootProvider, 'root');

export type RootProps = ComponentProps<typeof Root>;
export const Root = withProvider<
  Assign<
    Assign<HTMLStyledProps<'label'>, Checkbox.RootBaseProps>,
    CheckboxVariantProps
  >
>(Checkbox.Root, 'root');

export const Control = withContext<
  Assign<HTMLStyledProps<'div'>, Checkbox.ControlBaseProps>
>(Checkbox.Control, 'control');

export const Group = withContext<
  Assign<HTMLStyledProps<'div'>, Checkbox.GroupBaseProps>
>(Checkbox.Group, 'group');

export const Indicator = withContext<
  Assign<HTMLStyledProps<'div'>, Checkbox.IndicatorBaseProps>
>(Checkbox.Indicator, 'indicator');

export const Label = withContext<
  Assign<HTMLStyledProps<'span'>, Checkbox.LabelBaseProps>
>(Checkbox.Label, 'label');

export {
  CheckboxContext as Context,
  CheckboxHiddenInput as HiddenInput,
  type CheckboxCheckedChangeDetails as CheckedChangeDetails,
} from '@ark-ui/solid/checkbox';

export interface SimpleCheckboxProps extends RootProps {}
export const SimpleCheckbox = (props: SimpleCheckboxProps) => {
  const getChildren = children(() => props.children);

  return (
    <Root {...props}>
      <Control>
        <Indicator>
          <CheckIcon />
        </Indicator>
        <Indicator indeterminate={true}>
          <MinusIcon />
        </Indicator>
      </Control>
      <Show when={getChildren()}>
        <Label>{getChildren()}</Label>
      </Show>
      <CheckboxHiddenInput />
    </Root>
  );
};
