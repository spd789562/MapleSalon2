import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $showItemGender, setShowItemGender } from '@/store/settingDialog';

import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const ShowItemGenderSwitch = () => {
  const t = useTranslate();
  const showItemGender = useStore($showItemGender);

  function handleChange(details: ChangeDetails) {
    setShowItemGender(details.checked);
  }

  return (
    <Switch checked={showItemGender()} onCheckedChange={handleChange}>
      <Text>{t('setting.showItemGender')}</Text>
    </Switch>
  );
};
