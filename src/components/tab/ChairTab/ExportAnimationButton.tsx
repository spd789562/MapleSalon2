import { $globalRenderer } from '@/store/renderer';
import { $exportType, $addBlackBgWhenExportGif } from '@/store/settingDialog';
import { $interactionLock } from '@/store/trigger';

import { useChairTab } from './ChairTabContext';
import { useTranslate } from '@/context/i18n';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import { getAnimatedCharacterBlob } from '@/components/tab/ActionTab/helper';
import { chairToCanvasFrames } from '@/renderer/chair/chairToCanvasFrames';
import { downloadBlob, downloadCanvas } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

import { ActionExportType, ActionExportTypeExtensions } from '@/const/toolTab';

export const ExportAnimationButton = () => {
  const t = useTranslate();
  const [state, { startExport, finishExport, updateExportProgress }] =
    useChairTab();
  async function handleExport() {
    const app = $globalRenderer.get();
    if (!(app && state.chairRef)) {
      toaster.error({
        title: t('export.notLoaded'),
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
      const data = await chairToCanvasFrames(state.chairRef, app.renderer, {
        backgroundColor,
        onProgress: updateExportProgress,
      });
      if (data.frames.length === 1) {
        downloadCanvas(data.frames[0].canvas, `chair-${state.chairRef.id}.png`);
        toaster.success({
          title: t('export.success'),
        });
        $interactionLock.set(false);
        finishExport();
        return;
      }

      const blob = await getAnimatedCharacterBlob(data, exportType);
      downloadBlob(
        blob,
        `chair-${state.chairRef.id}${ActionExportTypeExtensions[exportType]}`,
      );

      toaster.success({
        title: t('export.success'),
      });
      $interactionLock.set(false);
      finishExport();
    } catch (_) {
      toaster.error({
        title: t('export.error'),
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
      title={t('export.animation')}
    >
      {t('export.animation')}
    </Button>
  );
};
