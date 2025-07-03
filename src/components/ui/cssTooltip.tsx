import type { Assign, HTMLArkProps } from '@ark-ui/solid';
import { ark } from '@ark-ui/solid/factory';
import { styled } from 'styled-system/jsx/factory';
import {
  type CssTooltipVariantProps,
  cssTooltip,
} from 'styled-system/recipes/css-tooltip';
import type { JsxStyleProps } from 'styled-system/types';

export interface CssTooltipProps
  extends Assign<JsxStyleProps, HTMLArkProps<'div'>>,
    CssTooltipVariantProps {}
export const CssTooltip = styled(ark.div, cssTooltip);
