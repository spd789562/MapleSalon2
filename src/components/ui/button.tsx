import type { Assign, HTMLArkProps } from '@ark-ui/solid';
import { ark } from '@ark-ui/solid/factory';
import { styled } from 'styled-system/jsx/factory';
import { type ButtonVariantProps, button } from 'styled-system/recipes/button';
import type { JsxStyleProps } from 'styled-system/types';

export interface ButtonProps
  extends Assign<JsxStyleProps, HTMLArkProps<'button'>>,
    ButtonVariantProps {}
export const Button = styled(ark.button, button);
