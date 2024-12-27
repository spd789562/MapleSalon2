import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $showItemDyeable, setShowItemDyeable } from '@/store/settingDialog';

import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const ShowItemDyeableSwitch = () => {
  const t = useTranslate();
  const showItemDyeable = useStore($showItemDyeable);

  function handleChange(details: ChangeDetails) {
    setShowItemDyeable(details.checked);
  }

  return (
    <Switch checked={showItemDyeable()} onCheckedChange={handleChange}>
      <Text>{t('setting.showItemDyeable')}</Text>
    </Switch>
  );
};
