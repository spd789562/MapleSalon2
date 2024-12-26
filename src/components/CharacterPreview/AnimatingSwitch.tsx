import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $isAnimating } from '@/store/character/selector';
import { toggleIsAnimating } from '@/store/character/action';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const AnimatingSwitch = () => {
  const t = useTranslate();
  const isAnimating = useStore($isAnimating);

  function handleChange(details: ChangeDetails) {
    toggleIsAnimating(details.checked);
  }

  return (
    <Switch checked={isAnimating()} onCheckedChange={handleChange}>
      {t('character.animated')}
    </Switch>
  );
};
