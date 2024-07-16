import { useStore } from '@nanostores/solid';

import { $showPreviousCharacter } from '@/store/trigger';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const ShowPreviousSwitch = () => {
  const isShow = useStore($showPreviousCharacter);

  function handleChange(details: ChangeDetails) {
    $showPreviousCharacter.set(details.checked);
  }

  return (
    <Switch checked={isShow()} onCheckedChange={handleChange}>
      顯示比對
    </Switch>
  );
};
