import { useStore } from '@nanostores/solid';

import { $dyeResultCount } from '@/store/toolTab';

import {
  NumberInput,
  type ValueChangeDetails,
} from '@/components/ui/numberInput';

export const ResultCountNumberInput = () => {
  const count = useStore($dyeResultCount);

  function handleCountChange(details: ValueChangeDetails) {
    $dyeResultCount.set(details.valueAsNumber);
  }

  return (
    <NumberInput
      min={32}
      max={200}
      value={count().toString()}
      onValueChange={handleCountChange}
      allowOverflow={false}
      width="6rem"
    />
  );
};
