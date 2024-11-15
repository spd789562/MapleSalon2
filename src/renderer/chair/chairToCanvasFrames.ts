import { type Renderer, Ticker } from 'pixi.js';

import type { Chair } from './chair';

import { makeFrames } from '../makeCanvasFrame';

import { createMergedTimeline } from '@/utils/timline';
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

  const mergedTimeline = createMergedTimeline(timelines);
  const totalFrameCount = mergedTimeline.length;

  if (totalFrameCount === 1) {
    const resultData = await makeFrames(chair, renderer, 1, {
      nextFrame: () => Promise.resolve(),
      backgroundColor: options?.backgroundColor,
      padWhiteSpace: options?.padWhiteSpace,
    });

    Ticker.shared.start();

    return resultData;
  }

  options?.onProgress?.(0, totalFrameCount);
  await nextTick();

  const time = performance.now();
  let add = 0;

  const resultData = await makeFrames(chair, renderer, totalFrameCount, {
    backgroundColor: options?.backgroundColor,
    padWhiteSpace: options?.padWhiteSpace,
    getFrameDelay: (i) =>
      mergedTimeline[i] - (i === 0 ? 0 : mergedTimeline[i - 1]),
    afterMakeFrame: (i) => {
      options?.onProgress?.(i + 1, totalFrameCount);
    },
    nextFrame: async (index) => {
      while (add < mergedTimeline[index]) {
        add += 16.66667;
        Ticker.shared.update(time + add);
        await nextTick();
      }
    },
  });

  Ticker.shared.start();

  return resultData;
}
