import { type Assign, type HTMLArkProps, ark } from '@ark-ui/solid';
import { styled } from 'styled-system/jsx/factory';
import {
  type TopBarToggleVariantProps,
  topBarToggle,
} from 'styled-system/recipes/top-bar-toggle';
import {
  type TopBarPositionerVariantProps,
  topBarPositioner,
} from 'styled-system/recipes/top-bar-positioner';
import type { JsxStyleProps } from 'styled-system/types';

export interface TopBarToggleProps
  extends Assign<JsxStyleProps, HTMLArkProps<'div'>>,
    TopBarToggleVariantProps {}
export const TopBarToggle = styled(ark.div, topBarToggle);

export interface TopBarPositionerProps
  extends Assign<JsxStyleProps, HTMLArkProps<'div'>>,
    TopBarPositionerVariantProps {}
export const TopBarPositioner = styled(ark.div, topBarPositioner);
