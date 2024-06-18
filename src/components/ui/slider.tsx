import {
  Slider as ArkSlider,
  type Assign,
  type SliderRootProps,
} from '@ark-ui/solid';
import { Index, type JSX, Show, children, splitProps } from 'solid-js';
import { css, cx } from 'styled-system/css';
import { splitCssProps } from 'styled-system/jsx/is-valid-prop';
import { type SliderVariantProps, slider } from 'styled-system/recipes/slider';
import type { JsxStyleProps } from 'styled-system/types';

export interface SliderProps
  extends Assign<JsxStyleProps, SliderRootProps>,
    SliderVariantProps {
  marks?: {
    value: number;
    label?: JSX.Element;
  }[];
}

/**
 * Park UI Slider component,
 * use `--ui-slider-track-background` to set the background of the track and
 * use `--ui-slider-range-background` to set the background of the range bar
 */
export const Slider = (props: SliderProps) => {
  const [variantProps, ratingGroupProps] = slider.splitVariantProps(props);
  const [cssProps, elementProps] = splitCssProps(ratingGroupProps);
  const [localProps, rootProps] = splitProps(elementProps, [
    'children',
    'class',
    'marks',
  ]);
  const getChildren = children(() => localProps.children);
  const styles = slider(variantProps);

  return (
    <ArkSlider.Root
      class={cx(styles.root, css(cssProps), localProps.class)}
      {...rootProps}
    >
      <ArkSlider.Context>
        {(api) => (
          <>
            <Show when={getChildren()}>
              <ArkSlider.Label class={styles.label}>
                {getChildren()}
              </ArkSlider.Label>
            </Show>
            <ArkSlider.Control class={styles.control}>
              <ArkSlider.Track
                class={cx(
                  css({
                    background:
                      'var(--ui-slider-track-background, var(--colors-bg-emphasized))',
                  }),
                  styles.track,
                )}
              >
                <ArkSlider.Range
                  class={cx(
                    css({
                      background:
                        'var(--ui-slider-range-background, var(--colors-colorPalette-default))',
                    }),
                    styles.range,
                  )}
                />
              </ArkSlider.Track>
              <Index each={api().value}>
                {(_, index) => (
                  <ArkSlider.Thumb index={index} class={styles.thumb} />
                )}
              </Index>
            </ArkSlider.Control>
            <Show when={localProps.marks}>
              <ArkSlider.MarkerGroup class={styles.markerGroup}>
                <Index each={localProps.marks}>
                  {(mark) => (
                    <ArkSlider.Marker
                      value={mark().value}
                      class={styles.marker}
                    >
                      {mark().label}
                    </ArkSlider.Marker>
                  )}
                </Index>
              </ArkSlider.MarkerGroup>
            </Show>
          </>
        )}
      </ArkSlider.Context>
    </ArkSlider.Root>
  );
};
