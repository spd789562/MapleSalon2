import { createSignal } from 'solid-js';
import { Button, type ButtonProps } from '@/components/ui/button';
import type { ActionCharacterRef } from './ActionCharacter';

import { toaster } from '@/components/GlobalToast';
import { getCharacterFrameBlobs } from './helper';
import { makeBlobsZipBlob } from '@/utils/exportImage/exportBlobToZip';
import { downloadBlob } from '@/utils/download';
import { nextTick } from '@/utils/eventLoop';

export interface ExportAnimateButtonProps {
  characterRefs: ActionCharacterRef[];
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
}
export const ExportFrameButton = (props: ExportAnimateButtonProps) => {
  const [isExporting, setIsExporting] = createSignal(false);

  async function handleClick() {
    if (isExporting()) {
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
    setIsExporting(true);
    await nextTick();

    try {
      const files: [Blob, string][] = [];
      for await (const characterRef of props.characterRefs) {
        const frameData = await characterRef.makeCharacterFrames();
        files.push(
          ...(await getCharacterFrameBlobs(frameData, characterRef.character)),
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
    }
  }

  return (
    <Button
      size={props.size}
      variant={props.variant}
      title="匯出動圖分鏡"
      onClick={handleClick}
    >
      匯出分鏡
    </Button>
  );
};
