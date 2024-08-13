import { getCurrentWindow } from '@tauri-apps/api/window';
import { useStore } from '@nanostores/solid';

import { $windowResizable, setWindowResizable } from '@/store/settingDialog';

import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const WindowResizableSwitch = () => {
  const windowResizable = useStore($windowResizable);

  async function handleChange(details: ChangeDetails) {
    const currentWindow = getCurrentWindow();
    await currentWindow.setResizable(details.checked);
    setWindowResizable(details.checked);
  }

  return (
    <Switch checked={windowResizable()} onCheckedChange={handleChange}>
      自由調整視窗大小
    </Switch>
  );
};
