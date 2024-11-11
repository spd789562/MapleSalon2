import type { JSX } from 'solid-js';
import { getCurrentWebview } from '@tauri-apps/api/webview';

import { refreshPage } from '@/store/action';
import { openDialog, DialogType } from '@/store/confirmDialog';

import Trash2Icon from 'lucide-solid/icons/trash-2';
import { Button } from '@/components/ui/button';
import { SettingTooltip } from '../SettingTooltip';

export const ClearCacheButton = () => {
  function handleClick() {
    openDialog({
      type: DialogType.Confirm,
      title: '確認是否清除暫存',
      description:
        '若資料確定為舊版本資料時再使用此功能，點擊確認後將會清出暫存並重整頁面',
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
      title="清除暫存資料"
      variant="outline"
    >
      <Trash2Icon />
      清除暫存資料
      <SettingTooltip tooltip="版本更新時若未顯示最新資料，可使用此功能清除暫存。此設定變更後須重整頁面" />
    </Button>
  );
};
