import { createSignal } from 'solid-js';

import { $actionExportType } from '@/store/toolTab';

import { Button, type ButtonProps } from '@/components/ui/button';
import type { ActionCharacterRef } from './ActionCharacter';

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
}
export const ExportAnimateButton = (props: ExportAnimateButtonProps) => {
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
    const exportType = $actionExportType.get();
    const exportExt = ActionExportTypeExtensions[exportType];

    try {
      const files: [Blob, string][] = [];
      if (props.characterRefs.length === 1) {
        const characterRef = props.characterRefs[0];
        const frameData = await characterRef.makeCharacterFrames();
        const blob = await getAnimatedCharacterBlob(frameData, exportType);
        const fileNameSuffix = getCharacterFilenameSuffix(
          characterRef.character,
        );
        downloadBlob(blob, `${fileNameSuffix}${exportExt}`);
      } else {
        for await (const characterRef of props.characterRefs) {
          const frameData = await characterRef.makeCharacterFrames();
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
    }
  }

  return (
    <Button
      size={props.size}
      variant={props.variant}
      onClick={handleClick}
      disabled={isExporting()}
    >
      匯出動圖
    </Button>
  );
};
