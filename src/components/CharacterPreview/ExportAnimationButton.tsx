import { $globalRenderer } from '@/store/renderer';
import { $interactionLock } from '@/store/trigger';

import { useCharacterPreview } from './CharacterPreviewContext';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import { getAnimatedCharacterBlob } from '@/components/tab/ActionTab/helper';
import { characterToCanvasFramesWithEffects } from '@/renderer/character/characterToCanvasFrames';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

import { ActionExportType } from '@/const/toolTab';

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
      const blob = await getAnimatedCharacterBlob(
        frames,
        ActionExportType.Webp,
      );
      downloadBlob(blob, 'character.webp');

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
    >
      匯出完整動畫
    </Button>
  );
};
