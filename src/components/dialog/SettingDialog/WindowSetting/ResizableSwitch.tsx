import { getCurrentWindow } from '@tauri-apps/api/window';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $windowResizable, setWindowResizable } from '@/store/settingDialog';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const ResizableSwitch = () => {
  const t = useTranslate();
  const windowResizable = useStore($windowResizable);

  async function handleChange(details: ChangeDetails) {
    const currentWindow = getCurrentWindow();
    await currentWindow.setResizable(details.checked);
    setWindowResizable(details.checked);
  }

  return (
    <Switch checked={windowResizable()} onCheckedChange={handleChange}>
      {t('setting.freeResize')}
    </Switch>
  );
};
