import { $globalRenderer } from '@/store/renderer';

import { useMountTab } from './MountTabContext';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import { extractCanvas } from '@/utils/extract';
import { copyCanvas } from '@/utils/clipboard';

export const ExportSnapshotToClipboardButton = () => {
  const [state] = useMountTab();

  async function handleClick() {
    if (state.isExporting) {
      return;
    }

    const app = $globalRenderer.get();
    if (!(app && state.mountRef)) {
      toaster.error({
        title: '尚未載入完畢',
      });
      return;
    }
    const frame = extractCanvas(
      state.mountRef,
      app.renderer,
    ) as HTMLCanvasElement;
    try {
      await copyCanvas(frame);
      toaster.success({
        title: '複製成功',
      });
    } catch (_) {
      toaster.error({
        title: '複製時發生未知錯誤',
      });
    }
  }

  return (
    <Button
      variant="outline"
      title="複製當前快照至剪貼簿"
      onClick={handleClick}
      disabled={state.isExporting}
    >
      複製快照
    </Button>
  );
};
