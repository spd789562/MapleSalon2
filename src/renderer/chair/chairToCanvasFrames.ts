import { type Renderer, Ticker } from 'pixi.js';

import type { Chair } from './chair';

import type {
  UniversalFrame,
  CanvasFramesData,
} from '../character/characterToCanvasFrames';

import { extractCanvas } from '@/utils/extract';
import { nextTick } from '@/utils/eventLoop';

export async function chairToCanvasFrames(
  chair: Chair,
  renderer: Renderer,
  options?: {
    backgroundColor?: string;
    padWhiteSpace?: boolean;
    onProgress?: (progress: number, total: number) => void;
  },
) {
  Ticker.shared.stop();
  const current = performance.now();
  Ticker.shared.update(current);

  /* reset chair frame */
  chair.resetDelta();

  await nextTick();

  const timelines = chair.getTimelines();

  const maxTime = timelines.reduce((acc, timeline) => {
    return Math.max(acc, timeline[timeline.length - 1]);
  }, 0);

  if (maxTime === 0) {
    const resultData = await makeFrames(chair, renderer, [0], {
      backgroundColor: options?.backgroundColor,
      padWhiteSpace: options?.padWhiteSpace,
    });

    Ticker.shared.start();

    return resultData;
  }

  for (const timeline of timelines) {
    // expanding exist timeline to nearset the maxTime
    const last = timeline[timeline.length - 1];
    let i = 0;
    while (last + timeline[i] <= maxTime) {
      timeline.push(last + timeline[i]);
      i++;
    }
  }
  const timelineSet = new Set<number>();
  for (const timeline of timelines) {
    for (const time of timeline) {
      timelineSet.add(time);
    }
  }
  const mergedTimeline = Array.from(timelineSet).sort((a, b) => a - b);
  const totalFrameCount = mergedTimeline.length;
  options?.onProgress?.(0, totalFrameCount);
  await nextTick();

  const resultData = await makeFrames(chair, renderer, mergedTimeline, {
    backgroundColor: options?.backgroundColor,
    padWhiteSpace: options?.padWhiteSpace,
    afterMakeFrame: (i) => {
      options?.onProgress?.(i + 1, totalFrameCount);
    },
  });

  Ticker.shared.start();

  return resultData;
}

async function makeFrames(
  chair: Chair,
  renderer: Renderer,
  timelines: number[],
  options: {
    backgroundColor?: string;
    padWhiteSpace?: boolean;
    beforeMakeFrame?: (index: number) => void;
    afterMakeFrame?: (index: number) => void;
  },
): Promise<CanvasFramesData> {
  const unprocessedFrames: UniversalFrame[] = [];

  const bound = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  const time = performance.now();
  let add = 0;

  for (let i = 0; i < timelines.length; i++) {
    options.beforeMakeFrame?.(i);

    const canvas = extractCanvas(chair, renderer) as HTMLCanvasElement;
    const frameBound = chair.getLocalBounds();
    const frameData: UniversalFrame = {
      canvas,
      delay: timelines[i] - (i === 0 ? 0 : timelines[i - 1]),
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

    while (add < timelines[i]) {
      add += 16.66667;
      Ticker.shared.update(time + add);
      await nextTick();
    }
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