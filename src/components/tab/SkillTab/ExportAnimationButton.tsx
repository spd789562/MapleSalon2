import { $globalRenderer } from '@/store/renderer';
import { $exportType, $addBlackBgWhenExportGif } from '@/store/settingDialog';
import { $interactionLock } from '@/store/trigger';

import { useSkillTab } from './SkillTabContext';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import { getAnimatedCharacterBlob } from '@/components/tab/ActionTab/helper';
import { characterToCanvasFramesWithEffects } from '@/renderer/character/characterToCanvasFrames';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

import { ActionExportType, ActionExportTypeExtensions } from '@/const/toolTab';

export const ExportAnimationButton = () => {
  const [state, { startExport, finishExport, updateExportProgress }] =
    useSkillTab();
  async function handleExport() {
    const app = $globalRenderer.get();
    if (!(app && state.skillRef && state.characterRef)) {
      toaster.error({
        title: '尚未載入完畢',
      });
      return;
    }
    try {
      startExport();
      $interactionLock.set(true);
      await nextTick();
      const exportType = $exportType.get() || ActionExportType.Webp;
      const backgroundColor =
        $addBlackBgWhenExportGif.get() && exportType === 'gif'
          ? '#000000'
          : undefined;
      const frames = await characterToCanvasFramesWithEffects(
        state.characterRef,
        app.renderer,
        {
          backgroundColor,
          onProgress: updateExportProgress,
        },
      );

      const blob = await getAnimatedCharacterBlob(frames, exportType);
      downloadBlob(
        blob,
        `skill-${state.skillRef.id}-${ActionExportTypeExtensions[exportType]}`,
      );

      toaster.success({
        title: '匯出成功',
      });
      $interactionLock.set(false);
      finishExport();
    } catch (_) {
      toaster.error({
        title: '匯出時發生未知錯誤，檔案可能過大',
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
      title="匯出動畫"
    >
      匯出動畫
    </Button>
  );
};
