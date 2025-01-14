import { createMemo } from 'solid-js';

import {
  NumberInput,
  type NumberInputProps,
  type ValueChangeDetails,
} from '@/components/ui/numberInput';
import { ActionFrameMap, type CharacterAction } from '@/const/actions';

export interface ActionFrameNumberInputProps {
  title?: string;
  width?: string;
  size: NumberInputProps['size'];
  value: number;
  onValueChange: (value: number) => void;
  action: CharacterAction;
  disabled?: boolean;
}
export const ActionFrameNumberInput = (props: ActionFrameNumberInputProps) => {
  const maxFrame = createMemo(() => {
    const action = props.action;
    return (ActionFrameMap[action] ?? 2) - 1;
  });

  function handleCountChange(details: ValueChangeDetails) {
    props.onValueChange(details.valueAsNumber);
  }

  return (
    <NumberInput
      title={props.title}
      min={0}
      max={maxFrame()}
      value={props.value.toString()}
      onValueChange={handleCountChange}
      allowOverflow={false}
      width={props.width ?? '4rem'}
      size={props.size}
      disabled={props.disabled}
    />
  );
};
