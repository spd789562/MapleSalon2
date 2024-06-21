import {
  NumberInput as ArkNumberInput,
  type Assign,
  type NumberInputRootProps,
} from '@ark-ui/solid'
import { Show, children, splitProps } from 'solid-js'
import { css, cx } from 'styled-system/css'
import { splitCssProps } from 'styled-system/jsx/is-valid-prop'
import { type NumberInputVariantProps, numberInput } from 'styled-system/recipes/number-input'
import type { JsxStyleProps } from 'styled-system/types'

import ChevronUpIcon from 'lucide-solid/icons/chevron-up'
import ChevronDownIcon from 'lucide-solid/icons/chevron-down'

export interface NumberInputProps
  extends Assign<JsxStyleProps, NumberInputRootProps>,
    NumberInputVariantProps {}

export const NumberInput = (props: NumberInputProps) => {
  const [variantProps, numberInputProps] = numberInput.splitVariantProps(props)
  const [cssProps, elementProps] = splitCssProps(numberInputProps)
  const [localProps, rootProps] = splitProps(elementProps, ['children', 'class'])
  const getChildren = children(() => localProps.children)
  const styles = numberInput(variantProps)

  return (
    <ArkNumberInput.Root class={cx(styles.root, css(cssProps), localProps.class)} {...rootProps}>
      <Show when={getChildren()}>
        <ArkNumberInput.Label class={styles.label}>{getChildren()}</ArkNumberInput.Label>
      </Show>
      <ArkNumberInput.Control class={styles.control}>
        <ArkNumberInput.Input class={styles.input} />
        <ArkNumberInput.IncrementTrigger class={styles.incrementTrigger}>
          <ChevronUpIcon />
        </ArkNumberInput.IncrementTrigger>
        <ArkNumberInput.DecrementTrigger class={styles.decrementTrigger}>
          <ChevronDownIcon />
        </ArkNumberInput.DecrementTrigger>
      </ArkNumberInput.Control>
    </ArkNumberInput.Root>
  )
}