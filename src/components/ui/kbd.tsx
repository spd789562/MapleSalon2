import type { Assign, HTMLArkProps } from '@ark-ui/solid';
import { ark } from '@ark-ui/solid/factory';
import { styled } from 'styled-system/jsx/factory';
import { type KbdVariantProps, kbd } from 'styled-system/recipes/kbd';
import type { JsxStyleProps } from 'styled-system/types';

export interface KbdProps
  extends Assign<JsxStyleProps, HTMLArkProps<'kbd'>>,
    KbdVariantProps {}
export const Kbd = styled(ark.kbd, kbd);
