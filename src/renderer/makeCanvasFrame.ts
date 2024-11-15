import type { Renderer, Container } from 'pixi.js';

import { extractCanvas } from '@/utils/extract';

interface UnprocessedFrame {
  width: number;
  height: number;
  left: number;
  top: number;
  delay: number;
  canvas: HTMLCanvasElement;
}

export type UniversalFrame = UnprocessedFrame;

export interface CanvasFramesData {
  frames: UniversalFrame[];
  width: number;
  height: number;
}
export async function makeFrames(
  anyContainer: Container,
  renderer: Renderer,
  count: number,
  options: {
    backgroundColor?: string;
    padWhiteSpace?: boolean;
    getFrameDelay?: (index: number) => number;
    beforeMakeFrame?: (index: number) => void;
    afterMakeFrame?: (index: number) => void;
    nextFrame: (index: number) => Promise<void>;
  },
): Promise<CanvasFramesData> {
  const unprocessedFrames: UniversalFrame[] = [];

  const bound = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  for (let i = 0; i < count; i++) {
    options.beforeMakeFrame?.(i);

    const canvas = extractCanvas(anyContainer, renderer) as HTMLCanvasElement;
    const frameBound = anyContainer.getLocalBounds();
    const frameData: UniversalFrame = {
      canvas,
      delay: options.getFrameDelay?.(i) || 100,
      width: canvas.width,
      height: canvas.height,
      left: frameBound.left,
      top: frameBound.top,
    };
    unprocessedFrames.push(frameData);

    bound.left = Math.min(bound.left, frameBound.left);
    bound.top = Math.min(bound.top, frameBound.top);
    bound.right = Math.max(bound.right, frameBound.right);
    bound.bottom = Math.max(bound.bottom, frameBound.bottom);

    options.afterMakeFrame?.(i);

    await options.nextFrame(i);
  }

  const maxWidth = bound.right - bound.left;
  const maxHeight = bound.bottom - bound.top;

  /* add padding to canvas */
  const basePos = {
    x: -bound.left,
    y: -bound.top,
  };
  const exportFrames = unprocessedFrames.map((frame) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const needPad =
      options.padWhiteSpace || options.padWhiteSpace === undefined;

    const top = needPad ? basePos.y + frame.top : -frame.top;
    const left = needPad ? basePos.x + frame.left : -frame.left;

    if (needPad) {
      canvas.width = maxWidth;
      canvas.height = maxHeight;
    } else {
      canvas.width = frame.width;
      canvas.height = frame.height;
    }

    if (options.backgroundColor) {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    if (needPad) {
      ctx.drawImage(frame.canvas, left, top);
    } else {
      ctx.drawImage(frame.canvas, 0, 0);
    }

    frame.canvas.remove();

    return {
      canvas,
      top,
      left,
      delay: frame.delay,
      width: canvas.width,
      height: canvas.height,
    };
  });

  return {
    frames: exportFrames,
    width: maxWidth,
    height: maxHeight,
  };
}
