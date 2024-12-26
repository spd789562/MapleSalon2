import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $showNameTag } from '@/store/character/selector';
import { toggleShowNameTag } from '@/store/character/action';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const NameTagSwitch = () => {
  const t = useTranslate();
  const checked = useStore($showNameTag);

  function handleChange(details: ChangeDetails) {
    toggleShowNameTag(details.checked);
  }

  return (
    <Switch checked={checked()} onCheckedChange={handleChange}>
      {t('character.showNameTag')}
    </Switch>
  );
};
