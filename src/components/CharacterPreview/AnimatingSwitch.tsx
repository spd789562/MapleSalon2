import { useStore } from '@nanostores/solid';

import { $currentCharacterInfo } from '@/store/character/store';
import { $isAnimating } from '@/store/character/selector';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const AnimatingSwitch = () => {
  const isAnimating = useStore($isAnimating);

  function handleChange(details: ChangeDetails) {
    $currentCharacterInfo.setKey('isAnimating', details.checked);
  }

  return (
    <Switch checked={isAnimating()} onCheckedChange={handleChange}>
      動畫
    </Switch>
  );
};
