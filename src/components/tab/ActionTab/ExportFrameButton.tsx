import { createSignal, Show } from 'solid-js';

import { $padWhiteSpaceWhenExportFrame } from '@/store/settingDialog';
import { $forceExportEffect } from '@/store/toolTab';

import { useActionTab } from './ActionTabContext';

import { Button, type ButtonProps } from '@/components/ui/button';
import type { ActionCharacterRef } from './ActionCharacter';
import { SpinLoading } from '@/components/elements/SpinLoading';

import ImagesIcon from 'lucide-solid/icons/images';
import { toaster } from '@/components/GlobalToast';
import { getCharacterFrameBlobs } from './helper';
import { makeBlobsZipBlob } from '@/utils/exportImage/exportBlobToZip';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

export interface ExportAnimateButtonProps {
  characterRefs: ActionCharacterRef[];
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
  isIcon?: boolean;
}
export const ExportFrameButton = (props: ExportAnimateButtonProps) => {
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
      ) && props.characterRefs.length !== 0;
    if (!isAllLoaded) {
      toaster.error({
        title: '動作尚未全部載入完畢',
      });
      return;
    }
    startExport();
    setIsExporting(true);
    await nextTick();
    const padWhiteSpace = $padWhiteSpaceWhenExportFrame.get();

    if (props.characterRefs.length > 5) {
      tooManyImageWarning();
    }

    try {
      const files: [Blob, string][] = [];
      for await (const characterRef of props.characterRefs) {
        const frameData = await characterRef.makeCharacterFrames({
          padWhiteSpace,
        });
        files.push(
          ...(await getCharacterFrameBlobs(frameData, characterRef.character, {
            includeMoveJson: padWhiteSpace === false,
          })),
        );
      }
      if (files.length === 1) {
        const file = files[0];
        downloadBlob(file[0], file[1]);
      } else {
        const zipBlob = await makeBlobsZipBlob(files);
        const fileName = 'character-action-split-frame.zip';
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
      title="匯出動圖分鏡"
      onClick={handleClick}
      disabled={isExporting() || state.isExporting}
    >
      <Show when={props.isIcon} fallback="匯出分鏡">
        <ImagesIcon />
      </Show>
      <Show when={isExporting()}>
        <SpinLoading size={16} />
      </Show>
    </Button>
  );
};
