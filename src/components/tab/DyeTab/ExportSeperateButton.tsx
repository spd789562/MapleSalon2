import { type JSX, createSignal } from 'solid-js';
import { useTranslate } from '@/context/i18n';

import { Button } from '@/components/ui/button';

import { makeImagesZipBlob } from '@/utils/exportImage/exportImageToZip';
import { downloadBlob } from '@/utils/download';
import { toaster } from '@/components/GlobalToast';

export interface ExportSeperateButtonProps {
  images: HTMLImageElement[];
  /** the image counts should be */
  imageCounts: number;
  fileName: string;
  children: JSX.Element;
  disabled?: boolean;
}
export const ExportSeperateButton = (props: ExportSeperateButtonProps) => {
  const t = useTranslate();
  const [isExporting, setIsExporting] = createSignal(false);

  async function handleClick() {
    if (isExporting()) {
      return;
    }
    const validImageCounts = props.images.filter((img) => img?.src).length;
    const isAllImagesLoaded = validImageCounts === props.imageCounts;
    if (!isAllImagesLoaded) {
      toaster.error({
        title: t('export.notLoaded'),
      });
      return;
    }
    setIsExporting(true);
    const zipBlob = await makeImagesZipBlob(props.images);
    downloadBlob(zipBlob, props.fileName);
    setIsExporting(false);
  }

  return (
    <Button
      size="sm"
      fontWeight="normal"
      onClick={handleClick}
      disabled={props.disabled || isExporting()}
    >
      {props.children}
    </Button>
  );
};
