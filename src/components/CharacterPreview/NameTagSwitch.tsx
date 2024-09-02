import { useStore } from '@nanostores/solid';

import { $showNameTag } from '@/store/character/selector';
import { toggleShowNameTag } from '@/store/character/action';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const NameTagSwitch = () => {
  const checked = useStore($showNameTag);

  function handleChange(details: ChangeDetails) {
    toggleShowNameTag(details.checked);
  }

  return (
    <Switch checked={checked()} onCheckedChange={handleChange}>
      顯示名牌
    </Switch>
  );
};
