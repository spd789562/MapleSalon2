import { $globalRenderer } from '@/store/renderer';
import { $exportType } from '@/store/settingDialog';
import { $interactionLock } from '@/store/trigger';

import { useCharacterPreview } from './CharacterPreviewContext';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import { getAnimatedCharacterBlob } from '@/components/tab/ActionTab/helper';
import { characterToCanvasFramesWithEffects } from '@/renderer/character/characterToCanvasFrames';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

import { ActionExportType, ActionExportTypeExtensions } from '@/const/toolTab';

export const ExportAnimationButton = () => {
  const [state, { startExport, finishExport, updateExportProgress }] =
    useCharacterPreview();
  async function handleExport() {
    const app = $globalRenderer.get();
    if (!(app && state.characterRef)) {
      toaster.error({
        title: '尚未載入完畢',
      });
      return;
    }
    try {
      startExport();
      $interactionLock.set(true);
      await nextTick();
      const frames = await characterToCanvasFramesWithEffects(
        state.characterRef,
        app.renderer,
        {
          onProgress: updateExportProgress,
        },
      );

      const exportType = $exportType.get() || ActionExportType.Webp;
      const blob = await getAnimatedCharacterBlob(frames, exportType);
      downloadBlob(blob, `character${ActionExportTypeExtensions[exportType]}`);

      toaster.success({
        title: '匯出成功',
      });
      $interactionLock.set(false);
      finishExport();
    } catch (e) {
      toaster.error({
        title: '匯出時發生未知錯誤',
      });
      finishExport();
      return $interactionLock.set(false);
    }
  }

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      disabled={state.isExporting}
      title="匯出含特效的完整動畫"
    >
      匯出完整動畫
    </Button>
  );
};
