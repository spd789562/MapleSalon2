import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $onlyShowDyeable } from '@/store/toolTab';

import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const OnlyDyeableSwitch = () => {
  const t = useTranslate();
  const checked = useStore($onlyShowDyeable);

  function handleChange(details: ChangeDetails) {
    $onlyShowDyeable.set(details.checked);
  }

  return (
    <Switch checked={checked()} onCheckedChange={handleChange}>
      <Text>{t('dye.onlyShowDyeable')}</Text>
    </Switch>
  );
};
