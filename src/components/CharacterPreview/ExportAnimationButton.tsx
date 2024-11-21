import { $isAnimating } from '@/store/character/selector';
import { $globalRenderer } from '@/store/renderer';
import { $exportType, $addBlackBgWhenExportGif } from '@/store/settingDialog';
import { $interactionLock } from '@/store/trigger';

import { useCharacterPreview } from './CharacterPreviewContext';

import type { Character } from '@/renderer/character/character';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import {
  getAnimatedCharacterBlob,
  getCharacterFilenameSuffix,
} from '@/components/tab/ActionTab/helper';
import { characterToCanvasFramesWithEffects } from '@/renderer/character/characterToCanvasFrames';
import { downloadBlob, downloadCanvas } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';
import { extractCanvas } from '@/utils/extract';

import { ActionExportType, ActionExportTypeExtensions } from '@/const/toolTab';

export function exportCharacterSnapshot(
  character?: Character,
  filename?: string,
) {
  const app = $globalRenderer.get();
  if (!(app && character)) {
    toaster.error({
      title: '尚未載入完畢',
    });
    return;
  }
  const actualFileName = filename || getCharacterFilenameSuffix(character);
  const frame = extractCanvas(character, app.renderer) as HTMLCanvasElement;
  downloadCanvas(frame, `${actualFileName}.png`);
}

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
    if (!$isAnimating.get()) {
      return exportCharacterSnapshot(state.characterRef);
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
      匯出動畫
    </Button>
  );
};
