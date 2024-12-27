import { getCurrentWebview } from '@tauri-apps/api/webview';
import { useTranslate } from '@/context/i18n';

import { refreshPage } from '@/store/action';
import { openDialog, DialogType } from '@/store/confirmDialog';

import Trash2Icon from 'lucide-solid/icons/trash-2';
import { Button } from '@/components/ui/button';
import { SettingTooltip } from '../SettingTooltip';

export const ClearCacheButton = () => {
  const t = useTranslate();
  function handleClick() {
    openDialog({
      type: DialogType.Confirm,
      title: t('setting.clearCacheConfirm'),
      description: t('setting.clearCacheDesc'),
      confirmButton: {
        isAsyncClick: true,
        onClick: async () => {
          const webview = getCurrentWebview();
          await webview.clearAllBrowsingData();
          await refreshPage();
        },
      },
    });
  }

  return (
    <Button
      onClick={handleClick}
      colorPalette="tomato"
      title={t('setting.clearCache')}
      variant="outline"
    >
      <Trash2Icon />
      {t('setting.clearCache')}
      <SettingTooltip tooltip={t('setting.clearCacheTip')} />
    </Button>
  );
};
