import { $globalRenderer } from '@/store/renderer';

import { useChairTab } from './ChairTabContext';

import { Button } from '@/components/ui/button';
import { extractCanvas } from '@/utils/extract';
import { downloadCanvas } from '@/utils/download';

import { toaster } from '@/components/GlobalToast';

export const ExportSnapshotButton = () => {
  const [state] = useChairTab();

  function handleClick() {
    if (state.isExporting) {
      return;
    }

    const app = $globalRenderer.get();
    if (!(app && state.chairRef)) {
      toaster.error({
        title: '尚未載入完畢',
      });
      return;
    }
    try {
      const data = extractCanvas(
        state.chairRef,
        app.renderer,
      ) as HTMLCanvasElement;
      downloadCanvas(data, `chair-${state.chairRef.id}.png`);
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
