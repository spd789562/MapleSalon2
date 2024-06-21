import type { Component, ComponentProps } from 'solid-js';

export type SvgProps = ComponentProps<'svg'>;

export type SvgIcon = Component<SvgProps>;

export enum IconType {
  Lucide = 'Lucide',
  Svg = 'Svg',
}
