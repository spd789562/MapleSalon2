import { useStore } from '@nanostores/solid';

import { $enableCharacterEffect } from '@/store/chair';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const EffectSwitch = () => {
  const isAnimating = useStore($enableCharacterEffect);

  function handleChange(details: ChangeDetails) {
    $enableCharacterEffect.set(details.checked);
  }

  return (
    <Switch checked={isAnimating()} onCheckedChange={handleChange}>
      顯示角色特效
    </Switch>
  );
};
