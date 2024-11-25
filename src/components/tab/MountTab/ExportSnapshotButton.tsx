import { $globalRenderer } from '@/store/renderer';

import { useMountTab } from './MountTabContext';

import { Button } from '@/components/ui/button';
import { extractCanvas } from '@/utils/extract';
import { downloadCanvas } from '@/utils/download';

import { toaster } from '@/components/GlobalToast';

export const ExportSnapshotButton = () => {
  const [state] = useMountTab();

  function handleClick() {
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
    try {
      const data = extractCanvas(
        state.mountRef,
        app.renderer,
      ) as HTMLCanvasElement;
      downloadCanvas(data, `mount-${state.mountRef.id}.png`);
    } catch (_) {
      toaster.error({
        title: '匯出時發生未知錯誤',
      });
    }
  }

  return (
    <Button
      variant="outline"
      title="匯出當前快照"
      onClick={handleClick}
      disabled={state.isExporting}
    >
      匯出快照
    </Button>
  );
};
