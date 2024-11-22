import { $globalRenderer } from '@/store/renderer';
import { $exportType, $addBlackBgWhenExportGif } from '@/store/settingDialog';
import { $interactionLock } from '@/store/trigger';

import { useSkillTab } from './SkillTabContext';

import { Button } from '@/components/ui/button';

import { toaster } from '@/components/GlobalToast';
import { getAnimatedCharacterBlob } from '@/components/tab/ActionTab/helper';
import { downloadBlob, downloadCanvas } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

import { ActionExportType, ActionExportTypeExtensions } from '@/const/toolTab';

export const ExportAnimationButton = () => {
  const [state, { startExport, finishExport, updateExportProgress }] =
    useSkillTab();
  async function handleExport() {
    const app = $globalRenderer.get();
    if (!(app && state.skillRef)) {
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
      // if (data.frames.length === 1) {
      //   downloadCanvas(data.frames[0].canvas, 'chair.png');
      //   toaster.success({
      //     title: '匯出成功',
      //   });
      //   $interactionLock.set(false);
      //   finishExport();
      //   return;
      // }

      // const blob = await getAnimatedCharacterBlob(data, exportType);
      // downloadBlob(blob, `chair${ActionExportTypeExtensions[exportType]}`);

      toaster.success({
        title: '匯出成功',
      });
      $interactionLock.set(false);
      finishExport();
    } catch (_) {
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
      title="匯出動畫"
    >
      匯出動畫
    </Button>
  );
};
