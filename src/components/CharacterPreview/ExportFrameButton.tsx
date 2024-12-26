import { $padWhiteSpaceWhenExportFrame } from '@/store/settingDialog';
import { $globalRenderer } from '@/store/renderer';

import { useCharacterPreview } from './CharacterPreviewContext';
import { useTranslate } from '@/context/i18n';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import { getCharacterFrameBlobs } from '@/components/tab/ActionTab/helper';
import { characterToCanvasFramesWithEffects } from '@/renderer/character/characterToCanvasFrames';
import { makeBlobsZipBlob } from '@/utils/exportImage/exportBlobToZip';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

export const ExportFrameButton = () => {
  const t = useTranslate();
  const [state, { startExport, finishExport, updateExportProgress }] =
    useCharacterPreview();

  async function handleClick() {
    if (state.isExporting) {
      return;
    }

    const app = $globalRenderer.get();
    if (!(app && state.characterRef)) {
      toaster.error({
        title: t('export.notLoaded'),
      });
      return;
    }
    startExport();
    await nextTick();
    const padWhiteSpace = $padWhiteSpaceWhenExportFrame.get();

    try {
      const files: [Blob, string][] = [];
      const frameData = await characterToCanvasFramesWithEffects(
        state.characterRef,
        app.renderer,
        {
          onProgress: updateExportProgress,
          padWhiteSpace,
        },
      );
      files.push(
        ...(await getCharacterFrameBlobs(frameData, state.characterRef, {
          includeMoveJson: padWhiteSpace === false,
        })),
      );
      if (files.length === 1) {
        const file = files[0];
        downloadBlob(file[0], file[1]);
      } else {
        const zipBlob = await makeBlobsZipBlob(files);
        const fileName = `${state.characterRef.name}-split-frame.zip`;
        downloadBlob(zipBlob, fileName);
      }
      toaster.success({
        title: t('export.success'),
      });
    } catch (_) {
      toaster.error({
        title: t('export.error'),
      });
    } finally {
      finishExport();
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={state.isExporting}
      title={t('export.currentFrames')}
    >
      {t('export.frames')}
    </Button>
  );
};
