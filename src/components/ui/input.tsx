import { type Assign, type HTMLArkProps, ark } from '@ark-ui/solid';
import { styled } from 'styled-system/jsx/factory';
import { type InputVariantProps, input } from 'styled-system/recipes/input';
import type { JsxStyleProps } from 'styled-system/types';

export interface InputProps
  extends Assign<
    Assign<JsxStyleProps, HTMLArkProps<'input'>>,
    InputVariantProps
  > {}
export const Input = styled(ark.input, input);
