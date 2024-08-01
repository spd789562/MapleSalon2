import type { JSX } from 'solid-js';

import { Button } from '@/components/ui/button';

import { downloadCanvas } from '@/utils/download';
import { toaster } from '@/components/GlobalToast';

const HEADER_HEIGHT = 28;
const COLOR_BLOCK_SIZE = 20;
const COLOR_BLOCK_COL_WIDTH = 40;
const TABLE_COL_GAP = 4;
const TABLE_ROW_GAP = 4;

export interface ExportTableButtonProps {
  images: HTMLImageElement[];
  avaialbeColorIds: number[];
  getColorHex: (colorId: number) => string;
  fileName: string;
  children: JSX.Element;
  disabled?: boolean;
}
export const ExportTableButton = (props: ExportTableButtonProps) => {
  async function handleClick() {
    const validImageCounts = props.images.filter((img) => img?.src).length;
    const colCounts = props.avaialbeColorIds.length;
    const isMixDyeTable = validImageCounts > colCounts;
    const rowCounts = isMixDyeTable ? colCounts : 1;
    const isAllImagesLoaded =
      validImageCounts > colCounts
        ? validImageCounts === colCounts * colCounts
        : validImageCounts === colCounts;
    if (!isAllImagesLoaded) {
      toaster.error({
        title: '圖片尚未載入完畢',
      });
      return;
    }
    const canvas = document.createElement('canvas');
    const tableImageItem = props.images[0];
    const tableColWidth = tableImageItem.width;

    const totalWidth =
      COLOR_BLOCK_COL_WIDTH + (tableColWidth + TABLE_COL_GAP) * colCounts;
    const totalHeight =
      HEADER_HEIGHT + (tableImageItem.height + TABLE_ROW_GAP) * rowCounts;

    canvas.width = totalWidth;
    canvas.height = totalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      toaster.error({
        title: '匯出失敗，無法建立 Canvas',
      });
      return;
    }
    drawColorBlockHeader(ctx, {
      avaialbeColorIds: props.avaialbeColorIds,
      getColorHex: props.getColorHex,
      firstColWidth: isMixDyeTable ? COLOR_BLOCK_COL_WIDTH : 0,
      tableColWidth,
      colHeight: HEADER_HEIGHT,
      colGap: TABLE_COL_GAP,
      colorBlockSize: COLOR_BLOCK_SIZE,
      colorBlockRound: 4,
    });
    let startY = HEADER_HEIGHT + TABLE_ROW_GAP;
    if (isMixDyeTable) {
      for (const [index, rowColorId] of props.avaialbeColorIds.entries()) {
        const sliceStart = index * colCounts;
        const sliceEnd = sliceStart + colCounts;
        drawImageRaw(ctx, {
          startY,
          images: props.images.slice(sliceStart, sliceEnd),
          firstColWidth: COLOR_BLOCK_COL_WIDTH,
          colGap: TABLE_COL_GAP,
          colorBlockColor: props.getColorHex(rowColorId),
          colorBlockColWidth: COLOR_BLOCK_COL_WIDTH,
          colorBlockSize: COLOR_BLOCK_SIZE,
          colorBlockRound: 4,
        });
        startY += props.images[0].height + TABLE_ROW_GAP;
      }
    } else {
      drawImageRaw(ctx, {
        startY,
        images: props.images.slice(0, colCounts),
        firstColWidth: COLOR_BLOCK_COL_WIDTH,
        colGap: TABLE_COL_GAP,
        colorBlockColWidth: COLOR_BLOCK_COL_WIDTH,
        colorBlockSize: COLOR_BLOCK_SIZE,
        colorBlockRound: 4,
      });
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

function drawColorBlockHeader(
  ctx: CanvasRenderingContext2D,
  options: {
    avaialbeColorIds: number[];
    getColorHex: (colorId: number) => string;
    firstColWidth: number;
    tableColWidth: number;
    colHeight: number;
    colGap: number;
    colorBlockSize: number;
    colorBlockRound: number;
  },
) {
  const {
    avaialbeColorIds,
    getColorHex,
    firstColWidth,
    tableColWidth,
    colHeight,
    colGap,
    colorBlockSize,
    colorBlockRound,
  } = options;
  /* start from first block */
  let startX = tableColWidth / 2 - colorBlockSize / 2;
  if (firstColWidth) {
    startX += firstColWidth + colGap;
  }
  const y = colHeight / 2 - colorBlockSize / 2;
  for (const colorId of avaialbeColorIds) {
    ctx.beginPath();
    ctx.fillStyle = getColorHex(colorId);
    ctx.roundRect(startX, y, colorBlockSize, colorBlockSize, colorBlockRound);
    ctx.fill();
    ctx.closePath();
    startX += tableColWidth + colGap;
  }
}

function drawImageRaw(
  ctx: CanvasRenderingContext2D,
  options: {
    startY: number;
    images: HTMLImageElement[];
    firstColWidth: number;
    colGap: number;
    colorBlockColor?: string;
    colorBlockColWidth: number;
    colorBlockSize: number;
    colorBlockRound: number;
  },
) {
  const {
    startY,
    images,
    firstColWidth,
    colGap,
    colorBlockColor,
    colorBlockColWidth,
    colorBlockSize,
    colorBlockRound,
  } = options;

  const colorBlockX = firstColWidth / 2 - colorBlockSize / 2;
  const colorBlockY = startY + colorBlockColWidth / 2 - colorBlockSize / 2;

  let x = 0;
  if (colorBlockColor) {
    ctx.beginPath();
    ctx.fillStyle = colorBlockColor;
    ctx.roundRect(
      colorBlockX,
      colorBlockY,
      colorBlockSize,
      colorBlockSize,
      colorBlockRound,
    );
    ctx.fill();
    ctx.closePath();

    x += firstColWidth + colGap;
  }

  for (const image of images) {
    ctx.drawImage(image, x, startY);
    x += image.width + colGap;
  }
}
