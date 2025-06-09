import { $isAnimating } from '@/store/character/selector';
import { $globalRenderer } from '@/store/renderer';
import { $exportType, $exportBackgroundColor } from '@/store/settingDialog';
import { $interactionLock } from '@/store/trigger';

import { useCharacterPreview } from './CharacterPreviewContext';
import { type AppTranslator, useTranslate } from '@/context/i18n';

import type { Character } from '@/renderer/character/character';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import {
  getAnimatedCharacterBlob,
  getCharacterFilenamePrefix,
} from '@/components/tab/ActionTab/helper';
import { characterToCanvasFramesWithEffects } from '@/renderer/character/characterToCanvasFrames';
import { downloadBlob, downloadCanvas } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';
import { extractCanvas } from '@/utils/extract';

import { ActionExportType, ActionExportTypeExtensions } from '@/const/toolTab';

export function exportCharacterSnapshot(
  t: AppTranslator,
  character?: Character,
  filename?: string,
) {
  const app = $globalRenderer.get();
  if (!(app && character)) {
    toaster.error({
      title: t('export.notLoaded'),
    });
    return;
  }
  const actualFileName = filename || getCharacterFilenamePrefix(character);
  const frame = extractCanvas(character, app.renderer) as HTMLCanvasElement;
  downloadCanvas(frame, `${actualFileName}.png`);
}

export const ExportAnimationButton = () => {
  const t = useTranslate();
  const [state, { startExport, finishExport, updateExportProgress }] =
    useCharacterPreview();

  async function handleExport() {
    const app = $globalRenderer.get();
    if (!(app && state.characterRef)) {
      toaster.error({
        title: t('export.notLoaded'),
      });
      return;
    }
    if (!$isAnimating.get()) {
      return exportCharacterSnapshot(t, state.characterRef, undefined);
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
          padWhiteSpace: true,
          backgroundColor,
          onProgress: updateExportProgress,
        },
      );

      const blob = await getAnimatedCharacterBlob(frames, exportType);
      downloadBlob(blob, `character${ActionExportTypeExtensions[exportType]}`);

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
      title={t('export.animationWithEffect')}
    >
      {t('export.animation')}
    </Button>
  );
};
