import { $globalRenderer } from '@/store/renderer';
import { $exportType, $exportBackgroundColor } from '@/store/settingDialog';
import { $interactionLock } from '@/store/trigger';

import { useSkillTab } from './SkillTabContext';
import { useTranslate } from '@/context/i18n';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import { getAnimatedCharacterBlob } from '@/components/tab/ActionTab/helper';
import { characterToCanvasFramesWithEffects } from '@/renderer/character/characterToCanvasFrames';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

import { ActionExportType, ActionExportTypeExtensions } from '@/const/toolTab';

export const ExportAnimationButton = () => {
  const t = useTranslate();
  const [state, { startExport, finishExport, updateExportProgress }] =
    useSkillTab();
  async function handleExport() {
    const app = $globalRenderer.get();
    if (!(app && state.skillRef && state.characterRef)) {
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
      const backgroundColor = $exportBackgroundColor.get();
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
        title: t('export.success'),
      });
      $interactionLock.set(false);
      finishExport();
    } catch (_) {
      toaster.error({
        title: t('export.errorFileTooBig'),
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
