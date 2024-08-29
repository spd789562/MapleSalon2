import { useStore } from '@nanostores/solid';

import { $dyeResultColumnCount } from '@/store/toolTab';

import {
  NumberInput,
  type ValueChangeDetails,
} from '@/components/ui/numberInput';

export const ResultColumnCountNumberInput = () => {
  const count = useStore($dyeResultColumnCount);

  function handleCountChange(details: ValueChangeDetails) {
    $dyeResultColumnCount.set(details.valueAsNumber);
  }

  return (
    <NumberInput
      min={2}
      max={20}
      value={count().toString()}
      onValueChange={handleCountChange}
      allowOverflow={false}
      width="6rem"
    />
  );
};
