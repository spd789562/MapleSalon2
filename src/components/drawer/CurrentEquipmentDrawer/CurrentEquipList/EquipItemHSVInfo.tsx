import { Show, Switch, Match } from 'solid-js';
import { css } from 'styled-system/css';

import { HStack } from 'styled-system/jsx/hstack';

export interface EquipItemHSVInfoProps {
  hue?: number;
  saturation?: number;
  value?: number;
}
export const EquipItemHSVInfo = (props: EquipItemHSVInfoProps) => {
  return (
    <HStack
      flex="1"
      fontSize="xs"
      backgroundColor="bg.emphasized"
      borderRadius="sm"
      px={2}
    >
      <Show when={props.hue}>
        {(value) => (
          <EquipItemHSVValueInfo
            backgroundGradient="hueConic"
            title="色相"
            value={value()}
          />
        )}
      </Show>
      <Show when={props.saturation}>
        {(value) => (
          <EquipItemHSVValueInfo
            backgroundGradient="saturation"
            title="飽和度"
            value={value()}
          />
        )}
      </Show>
      <Show when={props.value}>
        {(value) => (
          <EquipItemHSVValueInfo
            backgroundGradient="brightness"
            title="亮度"
            value={value()}
          />
        )}
      </Show>
    </HStack>
  );
};

export interface EquipItemHSVValueInfoProps {
  title: string;
  value: number;
  backgroundGradient: string;
}
export const EquipItemHSVValueInfo = (props: EquipItemHSVValueInfoProps) => {
  return (
    <span
      title={props.title}
      class={css({
        display: 'inline-flex',
        alignItems: 'center',
      })}
    >
      <ColorBlock backgroundGradient={props.backgroundGradient} />
      <NumberSign value={props.value} />
      {Math.abs(props.value)}
    </span>
  );
};

interface NumberSignProps {
  value: number;
}
export const NumberSign = (props: NumberSignProps) => {
  return (
    <Switch>
      <Match when={props.value > 0}>
        <span>+</span>
      </Match>
      <Match when={props.value < 0}>
        <span>-</span>
      </Match>
    </Switch>
  );
};

interface ColorBlockProps {
  backgroundGradient: string;
}
const ColorBlock = (props: ColorBlockProps) => {
  return (
    <div
      class={css({
        borderRadius: 'sm',
        width: '3',
        height: '3',
        display: 'inline-block',
        marginRight: '1',
        boxShadow: 'md',
        backgroundGradient: props.backgroundGradient,
        position: 'relative',
      })}
    />
  );
};
