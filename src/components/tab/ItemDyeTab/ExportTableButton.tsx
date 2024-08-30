import type { JSX } from 'solid-js';

import { Button } from '@/components/ui/button';

import { downloadCanvas } from '@/utils/download';
import { toaster } from '@/components/GlobalToast';

const TABLE_COL_GAP = 2;
const TABLE_ROW_GAP = 2;

export interface ExportTableButtonProps {
  images: HTMLImageElement[];
  imageCounts: number;
  columnCounts: number;
  fileName: string;
  children: JSX.Element;
  disabled?: boolean;
}
export const ExportTableButton = (props: ExportTableButtonProps) => {
  async function handleClick() {
    const validImageCounts = props.images.filter((img) => img?.src).length;
    const colCounts = props.columnCounts;
    const rowCounts = Math.ceil(props.imageCounts / colCounts);
    const isAllImagesLoaded = props.imageCounts === validImageCounts;
    if (!isAllImagesLoaded) {
      toaster.error({
        title: '圖片尚未載入完畢',
      });
      return;
    }
    const canvas = document.createElement('canvas');
    const tableImageItem = props.images[0];
    const tableColWidth = tableImageItem.width;

    const totalWidth = (tableColWidth + TABLE_COL_GAP) * colCounts;
    const totalHeight = (tableImageItem.height + TABLE_ROW_GAP) * rowCounts;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toaster.error({
        title: '匯出失敗，無法建立 Canvas',
      });
      return;
    }
    let startY = 0;
    for (let y = 0; y < rowCounts; y++) {
      for (let x = 0; x < colCounts; x++) {
        const index = y * colCounts + x;
        const image = props.images[index];
        if (!image) {
          continue;
        }
        ctx.drawImage(image, x * (tableColWidth + TABLE_COL_GAP), startY);
      }
      startY += tableImageItem.height + TABLE_ROW_GAP;
    }
    try {
      await downloadCanvas(canvas, props.fileName);
    } catch (_) {
      toaster.error({
        title: '匯出失敗，Canvas 無法建立 Blob',
      });
    }
  }

  return (
    <Button
      size="sm"
      fontWeight="normal"
      onClick={handleClick}
      disabled={props.disabled}
    >
      {props.children}
    </Button>
  );
};
