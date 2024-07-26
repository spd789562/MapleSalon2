import type { ComponentProps } from 'solid-js';
import { styled } from 'styled-system/jsx';
import { type TextVariantProps, text } from 'styled-system/recipes/text';
import type { StyledComponent } from 'styled-system/types';

type TextProps = TextVariantProps & {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export type HeadingProps = ComponentProps<typeof Heading>;
export const Heading = styled('h2', text, {
  defaultProps: { variant: 'heading' },
}) as StyledComponent<'h2', TextProps>;
