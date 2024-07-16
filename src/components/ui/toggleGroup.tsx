import { type JSX, Index, splitProps } from 'solid-js';
import { type Assign, ToggleGroup } from '@ark-ui/solid';
import {
  type ToggleGroupVariantProps,
  toggleGroup,
} from 'styled-system/recipes/toggle-group';
import type { JsxStyleProps } from 'styled-system/types';
import { createStyleContext } from '@/utils/create-style-context';

import { HStack } from 'styled-system/jsx/hstack';

const { withProvider, withContext } = createStyleContext(toggleGroup);

export interface RootProps
  extends Assign<JsxStyleProps, ToggleGroup.RootProps>,
    ToggleGroupVariantProps {}
export const Root = withProvider<RootProps>(ToggleGroup.Root, 'root');

export const Item = withContext<Assign<JsxStyleProps, ToggleGroup.ItemProps>>(
  ToggleGroup.Item,
  'item',
);

export {
  ToggleGroupContext as Context,
  type ToggleGroupContextProps as ContextProps,
  type ToggleGroupValueChangeDetails as ValueChangeDetails,
} from '@ark-ui/solid';

export interface SimpleToggleGroupProps<T extends string> extends RootProps {
  options: {
    label: JSX.Element;
    value: T;
    disabled?: boolean;
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
            <Item value={item().value} disabled={item().disabled} px={2}>
              {item().label}
            </Item>
          )}
        </Index>
      </HStack>
    </Root>
  );
};
