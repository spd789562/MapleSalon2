import type { WritableAtom } from 'nanostores';

import ResetIcon from 'lucide-solid/icons/rotate-ccw';
import { IconButton } from '@/components/ui/icon-button';

export interface MixDyeAlphaSliderProps {
  title: string;
  target: WritableAtom<number>;
}
export const SceneOffsetResetButton = (props: MixDyeAlphaSliderProps) => {
  function handleClick() {
    props.target.set(0);
  }

  return (
    <IconButton
      variant="outline"
      size="xs"
      title={`${props.title}`}
      onClick={handleClick}
    >
      <ResetIcon />
    </IconButton>
  );
};
