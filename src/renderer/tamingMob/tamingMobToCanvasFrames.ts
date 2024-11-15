import { type Renderer, Ticker } from 'pixi.js';

import type { TamingMob } from './tamingMob';

import { makeFrames } from '../makeCanvasFrame';

import { nextTick } from '@/utils/eventLoop';

export async function tamingMobToCanvasFrames(
  tamingMob: TamingMob,
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

  /* reset tamingMob frame */
  tamingMob.resetDelta();

  await nextTick();

  const timeline = tamingMob.currentItem?.timeline || [];

  if (timeline.length === 1) {
    const resultData = await makeFrames(tamingMob, renderer, 1, {
      nextFrame: () => Promise.resolve(),
      backgroundColor: options?.backgroundColor,
      padWhiteSpace: options?.padWhiteSpace,
    });

    Ticker.shared.start();

    return resultData;
  }

  options?.onProgress?.(0, timeline.length);
  await nextTick();

  const time = performance.now();
  let add = 0;

  const resultData = await makeFrames(tamingMob, renderer, timeline.length, {
    backgroundColor: options?.backgroundColor,
    padWhiteSpace: options?.padWhiteSpace,
    getFrameDelay: (i) => timeline[i] - (i === 0 ? 0 : timeline[i - 1]),
    afterMakeFrame: (i) => {
      options?.onProgress?.(i + 1, timeline.length);
    },
    nextFrame: async (index) => {
      while (add < timeline[index]) {
        add += 16.66667;
        Ticker.shared.update(time + add);
        await nextTick();
      }
    },
  });

  Ticker.shared.start();

  return resultData;
}
