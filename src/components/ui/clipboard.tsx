import type { Assign } from '@ark-ui/solid';
import { Clipboard } from '@ark-ui/solid/clipboard';
import type { ComponentProps } from 'solid-js';
import {
  type ClipboardVariantProps,
  clipboard,
} from 'styled-system/recipes/clipboard';
import type { HTMLStyledProps } from 'styled-system/types';
import { createStyleContext } from '@/utils/create-style-context';
import CheckIcon from 'lucide-solid/icons/check';
import ClipboardCopyIcon from 'lucide-solid/icons/clipboard-copy';
import { IconButton } from './icon-button';
import { Text, type TextProps } from './text';

const { withProvider, withContext } = createStyleContext(clipboard);

export type RootProviderProps = ComponentProps<typeof RootProvider>;
export const RootProvider = withProvider<
  Assign<
    Assign<HTMLStyledProps<'div'>, Clipboard.RootProviderBaseProps>,
    ClipboardVariantProps
  >
>(Clipboard.RootProvider, 'root');

export type RootProps = ComponentProps<typeof Root>;
export const Root = withProvider<
  Assign<
    Assign<HTMLStyledProps<'div'>, Clipboard.RootBaseProps>,
    ClipboardVariantProps
  >
>(Clipboard.Root, 'root');

export const Control = withContext<
  Assign<HTMLStyledProps<'div'>, Clipboard.ControlBaseProps>
>(Clipboard.Control, 'control');

export const Indicator = withContext<
  Assign<HTMLStyledProps<'div'>, Clipboard.IndicatorBaseProps>
>(Clipboard.Indicator, 'indicator');

export const Input = withContext<
  Assign<HTMLStyledProps<'input'>, Clipboard.InputBaseProps>
>(Clipboard.Input, 'input');

export const Label = withContext<
  Assign<HTMLStyledProps<'label'>, Clipboard.LabelBaseProps>
>(Clipboard.Label, 'label');

export const Trigger = withContext<
  Assign<HTMLStyledProps<'button'>, Clipboard.TriggerBaseProps>
>(Clipboard.Trigger, 'trigger');

export { ClipboardContext as Context } from '@ark-ui/solid/clipboard';

export const SimpleTextClipboard = (props: {
  value: string;
  textProps?: TextProps;
}) => {
  return (
    <Root value={props.value}>
      <Control alignItems="center">
        <Text {...props.textProps}>{props.value}</Text>
        <Clipboard.Trigger
          asChild={(triggerProps) => (
            <IconButton size="xs" variant="ghost" {...triggerProps()}>
              <Clipboard.Indicator copied={<CheckIcon />}>
                <ClipboardCopyIcon />
              </Clipboard.Indicator>
            </IconButton>
          )}
        />
      </Control>
    </Root>
  );
};

export interface PureTextClipboardProps {
  value: string;
}
export const PureTextClipboard = (props: PureTextClipboardProps) => {
  return (
    <Root value={props.value}>
      <Clipboard.Control>
        <Clipboard.Trigger>
          {props.value}
          <Clipboard.Indicator
            copied={<CheckIcon size="14" fill="#afa" />}
            style={{ display: 'inline-block', 'margin-left': '0.3rem' }}
          />
        </Clipboard.Trigger>
      </Clipboard.Control>
    </Root>
  );
};
