import { createSignal, Show } from 'solid-js';

import { $actionExportType, $forceExportEffect } from '@/store/toolTab';
import { $addBlackBgWhenExportGif } from '@/store/settingDialog';

import { useActionTab } from './ActionTabContext';

import ImagePlay from 'lucide-solid/icons/image-play';
import { Button, type ButtonProps } from '@/components/ui/button';
import type { ActionCharacterRef } from './ActionCharacter';
import { SpinLoading } from '@/components/elements/SpinLoading';

import { ActionExportTypeExtensions } from '@/const/toolTab';

import { toaster } from '@/components/GlobalToast';
import { getAnimatedCharacterBlob, getCharacterFilenameSuffix } from './helper';
import { makeBlobsZipBlob } from '@/utils/exportImage/exportBlobToZip';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

export interface ExportAnimateButtonProps {
  characterRefs: ActionCharacterRef[];
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  isIcon?: boolean;
}
export const ExportAnimateButton = (props: ExportAnimateButtonProps) => {
  const [state, { startExport, finishExport }] = useActionTab();
  const [isExporting, setIsExporting] = createSignal(false);

  function tooManyImageWarning() {
    if (!$forceExportEffect.get()) {
      return;
    }
    toaster.create({
      title: '正在匯出',
      description:
        '因啟用特效匯出，需花費較長的時間，請勿離開此分頁，將導致匯出中斷',
    });
  }

  async function handleClick() {
    if (isExporting() || state.isExporting) {
      return;
    }
    const isAllLoaded =
      props.characterRefs.every(
        (characterRef) => !characterRef.character.isLoading,
      ) && props.characterRefs.length >= 0;
    if (!isAllLoaded) {
      toaster.error({
        title: '動作尚未全部載入完畢',
      });
      return;
    }
    startExport();
    setIsExporting(true);
    await nextTick();
    const exportType = $actionExportType.get();
    const exportExt = ActionExportTypeExtensions[exportType];

    if (props.characterRefs.length > 5) {
      tooManyImageWarning();
    }

    try {
      const files: [Blob, string][] = [];
      const backgroundColor =
        $addBlackBgWhenExportGif.get() && exportType === 'gif'
          ? '#000000'
          : undefined;
      if (props.characterRefs.length === 1) {
        const characterRef = props.characterRefs[0];
        const frameData = await characterRef.makeCharacterFrames({
          backgroundColor,
        });
        const blob = await getAnimatedCharacterBlob(frameData, exportType);
        const fileNameSuffix = getCharacterFilenameSuffix(
          characterRef.character,
        );
        downloadBlob(blob, `${fileNameSuffix}${exportExt}`);
      } else {
        for await (const characterRef of props.characterRefs) {
          const frameData = await characterRef.makeCharacterFrames({
            backgroundColor,
          });
          const blob = await getAnimatedCharacterBlob(frameData, exportType);
          const fileNameSuffix = getCharacterFilenameSuffix(
            characterRef.character,
          );
          files.push([blob, `${fileNameSuffix}${exportExt}`]);
        }
        const zipBlob = await makeBlobsZipBlob(files);
        const fileName = 'character-action.zip';
        downloadBlob(zipBlob, fileName);
      }
      toaster.success({
        title: '匯出成功',
      });
    } catch (_) {
      toaster.error({
        title: '匯出發生未知錯誤',
      });
    } finally {
      setIsExporting(false);
      finishExport();
    }
  }

  return (
    <Button
      size={props.size}
      variant={props.variant}
      onClick={handleClick}
      disabled={isExporting() || state.isExporting}
      title="匯出動圖"
    >
      <Show when={props.isIcon} fallback="匯出動圖">
        <ImagePlay />
      </Show>
      <Show when={isExporting()}>
        <SpinLoading size={16} />
      </Show>
    </Button>
  );
};
