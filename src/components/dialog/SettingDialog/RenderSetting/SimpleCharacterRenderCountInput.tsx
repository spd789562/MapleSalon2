import { useStore } from '@nanostores/solid';

import {
  $simpleCharacterConcurrency,
  setSimpleCharacterConcurrency,
} from '@/store/settingDialog';

import {
  NumberInput,
  type ValueChangeDetails,
} from '@/components/ui/numberInput';

import {
  simpleCharacterLoadingQueue,
  SUGGEST_MAX_CONCURRENCY,
} from '@/utils/characterLoadingQueue';

export const SimpleCharacterRenderCountInput = () => {
  const concurrency = useStore($simpleCharacterConcurrency);

  function handleChange(details: ValueChangeDetails) {
    const value = Math.max(
      1,
      Math.min(details.valueAsNumber, SUGGEST_MAX_CONCURRENCY),
    );
    if (value === concurrency()) {
      return;
    }
    simpleCharacterLoadingQueue.concurrency = value;
    setSimpleCharacterConcurrency(value);
  }

  return (
    <NumberInput
      min={1}
      max={SUGGEST_MAX_CONCURRENCY}
      value={concurrency().toString()}
      onValueChange={handleChange}
    >
      角色快照同時渲染數量
    </NumberInput>
  );
};
