import { type Assign, Select } from '@ark-ui/solid';
import { type SelectVariantProps, select } from 'styled-system/recipes/select';
import type { JsxStyleProps } from 'styled-system/types';
import { createStyleContext } from '@/utils/create-style-context';
import { Index, Show, splitProps } from 'solid-js';
import ChevronsUpDownIcon from 'lucide-solid/icons/chevrons-up-down';
import CheckIcon from 'lucide-solid/icons/check';

const { withProvider, withContext } = createStyleContext(select);

export interface RootProps
  extends Assign<JsxStyleProps, Select.RootProps<Select.CollectionItem>>,
    SelectVariantProps {}
export const Root = withProvider<RootProps>(Select.Root, 'root');

export const ClearTrigger = withContext<
  Assign<JsxStyleProps, Select.ClearTriggerProps>
>(Select.ClearTrigger, 'clearTrigger');

export const Content = withContext<Assign<JsxStyleProps, Select.ContentProps>>(
  Select.Content,
  'content',
);

export const Control = withContext<Assign<JsxStyleProps, Select.ControlProps>>(
  Select.Control,
  'control',
);

export const Indicator = withContext<
  Assign<JsxStyleProps, Select.IndicatorProps>
>(Select.Indicator, 'indicator');

export const ItemGroupLabel = withContext<
  Assign<JsxStyleProps, Select.ItemGroupLabelProps>
>(Select.ItemGroupLabel, 'itemGroupLabel');

export const ItemGroup = withContext<
  Assign<JsxStyleProps, Select.ItemGroupProps>
>(Select.ItemGroup, 'itemGroup');

export const ItemIndicator = withContext<
  Assign<JsxStyleProps, Select.ItemIndicatorProps>
>(Select.ItemIndicator, 'itemIndicator');

export const Item = withContext<Assign<JsxStyleProps, Select.ItemProps>>(
  Select.Item,
  'item',
);

export const ItemText = withContext<
  Assign<JsxStyleProps, Select.ItemTextProps>
>(Select.ItemText, 'itemText');

export const Label = withContext<Assign<JsxStyleProps, Select.LabelProps>>(
  Select.Label,
  'label',
);

export const Positioner = withContext<
  Assign<JsxStyleProps, Select.PositionerProps>
>(Select.Positioner, 'positioner');

export const Trigger = withContext<Assign<JsxStyleProps, Select.TriggerProps>>(
  Select.Trigger,
  'trigger',
);

export const ValueText = withContext<
  Assign<JsxStyleProps, Select.ValueTextProps>
>(Select.ValueText, 'valueText');

export {
  SelectContext as Context,
  SelectHiddenSelect as HiddenSelect,
  type SelectContextProps as ContextProps,
  type SelectHiddenSelectProps as HiddenSelectProps,
  type SelectValueChangeDetails as ValueChangeDetails,
} from '@ark-ui/solid';

export interface SimpleSelectProps<V> extends RootProps {
  items: {
    label: string;
    value: V;
  }[];
  placeholder?: string;
  groupTitle?: string;
  maxHeight?: string | number;
}
export const SimpleSelect = <V extends string | number>(
  props: SimpleSelectProps<V>,
) => {
  const [local, sliderRootProps] = splitProps(props, [
    'placeholder',
    'groupTitle',
    'items',
    'maxHeight',
  ]);

  const itemToValue = (item: unknown) =>
    (
      item as {
        label: string;
        value: V;
      }
    ).value as string;

  return (
    <Root {...sliderRootProps} itemToValue={itemToValue} items={local.items}>
      <Control>
        <Trigger>
          <ValueText placeholder={local.placeholder} />
          <ChevronsUpDownIcon />
        </Trigger>
      </Control>
      <Positioner>
        <Content overflow="auto" maxHeight={local.maxHeight || 'unset'}>
          <ItemGroup>
            <Show when={local.groupTitle}>
              <ItemGroupLabel>{local.groupTitle}</ItemGroupLabel>
            </Show>
            <Index each={local.items}>
              {(option) => (
                <Item item={option()}>
                  <ItemText>{option().label}</ItemText>
                  <ItemIndicator>
                    <CheckIcon />
                  </ItemIndicator>
                </Item>
              )}
            </Index>
          </ItemGroup>
        </Content>
      </Positioner>
    </Root>
  );
};
