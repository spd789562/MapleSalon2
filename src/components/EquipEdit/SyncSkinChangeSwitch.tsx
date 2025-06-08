import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $equipmentDrawerSyncSkinChange } from '@/store/trigger';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const SyncSkinChangeSwitch = () => {
  const t = useTranslate();
  const isSyncSkinChange = useStore($equipmentDrawerSyncSkinChange);

  function handleChange(details: ChangeDetails) {
    $equipmentDrawerSyncSkinChange.set(details.checked);
  }

  return (
    <Switch checked={isSyncSkinChange()} onCheckedChange={handleChange}>
      {t('setting.syncSkinChange')}
    </Switch>
  );
};
