import { useStore } from '@nanostores/solid';

import { $dyeCharacterFrameIndex, $dyeAction } from '@/store/toolTab';

import { ActionFrameNumberInput } from '@/components/elements/ActionFrameNumberInput';

export const ResultActionFrameNumberInput = () => {
  const count = useStore($dyeCharacterFrameIndex);
  const action = useStore($dyeAction);

  function handleCountChange(count: number) {
    $dyeCharacterFrameIndex.set(count);
  }

  return (
    <ActionFrameNumberInput
      action={action()}
      value={count()}
      onValueChange={handleCountChange}
      size="sm"
    />
  );
};
