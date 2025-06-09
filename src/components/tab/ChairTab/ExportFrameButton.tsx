import { $globalRenderer } from '@/store/renderer';
import {
  $exportBackgroundColor,
  $padWhiteSpaceWhenExportFrame,
} from '@/store/settingDialog';
import { $interactionLock } from '@/store/trigger';
import { $currentChair } from '@/store/chair';

import { useChairTab } from './ChairTabContext';
import { useTranslate } from '@/context/i18n';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import { getCharacterFrameBlobs } from '@/components/tab/ActionTab/helper';
import { chairToCanvasFrames } from '@/renderer/chair/chairToCanvasFrames';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

import { makeBlobsZipBlob } from '@/utils/exportImage/exportBlobToZip';

export const ExportFrameButton = () => {
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
      const padWhiteSpace = $padWhiteSpaceWhenExportFrame.get();
      const backgroundColor = $exportBackgroundColor.get();
      const data = await chairToCanvasFrames(state.chairRef, app.renderer, {
        backgroundColor,
        padWhiteSpace,
        onProgress: updateExportProgress,
      });
      const chairName = $currentChair.get()?.name;
      const files: [Blob, string][] = [];
      files.push(
        ...(await getCharacterFrameBlobs(
          data,
          state.chairRef.characters[0][0],
          {
            includeMoveJson: padWhiteSpace === false,
            prefix: chairName,
          },
        )),
      );
      if (files.length === 1) {
        const file = files[0];
        downloadBlob(file[0], file[1]);
      } else {
        const zipBlob = await makeBlobsZipBlob(files);
        const fileName = `${chairName}-split-frame.zip`;
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
      $interactionLock.set(false);
    }
  }

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      disabled={state.isExporting}
      title={t('export.currentFrames')}
    >
      {t('export.frames')}
    </Button>
  );
};
