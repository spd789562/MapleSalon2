import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import {
  $currentAction,
  $currentFrame,
  $isAnimating,
} from '@/store/character/selector';
import { setCharacterFrame } from '@/store/character/action';

import { ActionFrameNumberInput as BaseActionFrameNumberInput } from '@/components/elements/ActionFrameNumberInput';

export const ActionFrameNumberInput = () => {
  const t = useTranslate();
  const frame = useStore($currentFrame);
  const action = useStore($currentAction);
  const isAnimating = useStore($isAnimating);

  function handleCountChange(frame: number) {
    setCharacterFrame(frame);
  }

  return (
    <BaseActionFrameNumberInput
      title={t('character.frame')}
      action={action()}
      value={frame()}
      onValueChange={handleCountChange}
      size="sm"
      disabled={isAnimating()}
    />
  );
};
