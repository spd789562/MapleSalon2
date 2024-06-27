import type { Assign, HTMLArkProps } from '@ark-ui/solid';
import { mergeProps, splitProps } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { css, cx } from 'styled-system/css';
import { splitCssProps } from 'styled-system/jsx/is-valid-prop';
import { type TextVariantProps, text } from 'styled-system/recipes/text';
import type { JsxStyleProps } from 'styled-system/types';

export interface EllipsisTextProps
  extends Assign<JsxStyleProps, HTMLArkProps<'p'>>,
    TextVariantProps {
  as?: 'p' | 'label' | 'div' | 'span';
  clamp?: number;
}

export const EllipsisText = (props: EllipsisTextProps) => {
  const mergedProps = mergeProps({ as: 'p' }, props);
  const [variantProps, textProps] = splitProps(mergedProps, [
    'size',
    'variant',
  ]);
  const [cssProps, elementProps] = splitCssProps(textProps);
  const [localProps, rootProps] = splitProps(elementProps, ['as', 'class']);
  const className = text(variantProps);
  const ellipsisStyle = css({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

  return (
    <Dynamic
      component={localProps.as}
      class={cx(className, css(cssProps), ellipsisStyle, localProps.class)}
      {...rootProps}
    />
  );
};
