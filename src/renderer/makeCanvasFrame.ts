import type { Renderer, Container } from 'pixi.js';
import { Bounds } from 'pixi.js';

import { extractCanvas } from '@/utils/extract';

interface UnprocessedFrame {
  width: number;
  height: number;
  left: number;
  top: number;
  delay: number;
  canvas: HTMLCanvasElement;
  name?: string;
}

export type UniversalFrame = UnprocessedFrame;

export interface CanvasFramesData {
  frames: UniversalFrame[] | UniversalFrame[][];
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

  const bound = new Bounds();

  for (let i = 0; i < count; i++) {
    options.beforeMakeFrame?.(i);

    const canvas = extractCanvas(anyContainer, renderer) as HTMLCanvasElement;
    const frameBound = anyContainer.getLocalBounds();
    const frameData: UniversalFrame = {
      canvas,
      delay: options.getFrameDelay?.(i) || 100,
      width: canvas.width,
      height: canvas.height,
      left: -frameBound.left,
      top: -frameBound.top,
    };
    unprocessedFrames.push(frameData);
    bound.addBounds(frameBound);

    options.afterMakeFrame?.(i);

    await options.nextFrame(i);
  }

  const maxWidth = bound.right - bound.left;
  const maxHeight = bound.bottom - bound.top;

  if (options.padWhiteSpace) {
    return toPaddedFrames(unprocessedFrames, bound, {
      backgroundColor: options.backgroundColor,
    });
  }

  return {
    frames: unprocessedFrames,
    width: maxWidth,
    height: maxHeight,
  };
}

export function toPaddedFrames(
  frames: UniversalFrame[],
  bounds: Bounds,
  options?: {
    backgroundColor?: string;
  },
) {
  const maxWidth = bounds.right - bounds.left;
  const maxHeight = bounds.bottom - bounds.top;

  const exportFrames = frames.map((frame) => {
    const canvas = document.createElement('canvas');
    canvas.width = maxWidth;
    canvas.height = maxHeight;

    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.imageSmoothingEnabled = false;
    const top = -bounds.top - frame.top;
    const left = -bounds.left - frame.left;

    if (options?.backgroundColor) {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(frame.canvas, left, top);

    frame.canvas.width = 0;
    frame.canvas.height = 0;
    frame.canvas.remove();

    return {
      canvas,
      top,
      left,
      name: frame.name,
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
