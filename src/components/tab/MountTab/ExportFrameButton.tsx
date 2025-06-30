import { $globalRenderer } from '@/store/renderer';
import {
  $exportBackgroundColor,
  $padWhiteSpaceWhenExportFrame,
} from '@/store/settingDialog';
import { $interactionLock } from '@/store/trigger';
import { $currentMount, $mountAction } from '@/store/mount';

import { useMountTab } from './MountTabContext';
import { useTranslate } from '@/context/i18n';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import { getCharacterFrameBlobs } from '@/components/tab/ActionTab/helper';
import { tamingMobToCanvasFrames } from '@/renderer/tamingMob/tamingMobToCanvasFrames';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

import { makeBlobsZipBlob } from '@/utils/exportImage/exportBlobToZip';

export const ExportFrameButton = () => {
  const t = useTranslate();
  const [state, { startExport, finishExport, updateExportProgress }] =
    useMountTab();
  async function handleExport() {
    const app = $globalRenderer.get();
    if (!(app && state.mountRef)) {
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
      const data = await tamingMobToCanvasFrames(state.mountRef, app.renderer, {
        backgroundColor,
        padWhiteSpace,
        onProgress: updateExportProgress,
      });
      const mountName = $currentMount.get()?.name;
      const mountAction = $mountAction.get();
      const files: [Blob, string][] = [];
      files.push(
        ...(await getCharacterFrameBlobs(
          data,
          state.mountRef.characters[0][0],
          {
            includeMoveJson: padWhiteSpace === false,
            prefix: `${mountName}-${mountAction}`,
          },
        )),
      );
      if (files.length === 1) {
        const file = files[0];
        downloadBlob(file[0], file[1]);
      } else {
        const zipBlob = await makeBlobsZipBlob(files);
        const fileName = `${mountName}-${mountAction}-split-frame.zip`;
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
