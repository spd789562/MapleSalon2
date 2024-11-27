import { type Accessor, createEffect } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $enableCharacterEffect } from '@/store/chair';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

import type { Character } from '@/renderer/character/character';

export const useCharacterEffectVisible = (
  character: (Character | Character[])[],
  disabled: Accessor<boolean>,
) => {
  const isEnabled = useStore($enableCharacterEffect);

  createEffect(() => {
    const enableEffect = isEnabled();
    if (!disabled()) {
      for (const ch of character.flat()) {
        ch.toggleEffectVisibility(!enableEffect);
      }
    }
  });
};

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
