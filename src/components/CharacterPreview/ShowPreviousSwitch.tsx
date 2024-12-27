import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $showPreviousCharacter } from '@/store/trigger';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const ShowPreviousSwitch = () => {
  const t = useTranslate();
  const isShow = useStore($showPreviousCharacter);

  function handleChange(details: ChangeDetails) {
    $showPreviousCharacter.set(details.checked);
  }

  return (
    <Switch checked={isShow()} onCheckedChange={handleChange}>
      {t('setting.showCompare')}
    </Switch>
  );
};
