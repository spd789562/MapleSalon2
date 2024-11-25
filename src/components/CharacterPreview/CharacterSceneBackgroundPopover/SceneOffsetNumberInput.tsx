import type { WritableAtom } from 'nanostores';
import { useStore } from '@nanostores/solid';

import {
  NumberInput,
  type ValueChangeDetails,
} from '@/components/ui/numberInput';

export interface SceneOffsetNumberInputProps {
  target: WritableAtom<number>;
  max?: number;
  min?: number;
}
export const SceneOffsetNumberInput = (props: SceneOffsetNumberInputProps) => {
  const count = useStore(props.target);

  function handleCountChange(details: ValueChangeDetails) {
    props.target.set(details.valueAsNumber);
  }

  return (
    <NumberInput
      min={props.min ?? -2000}
      max={props.max ?? 2000}
      value={count().toString()}
      onValueChange={handleCountChange}
      allowOverflow={false}
      width="8rem"
      size="sm"
    />
  );
};
