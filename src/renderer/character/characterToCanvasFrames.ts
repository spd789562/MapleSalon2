import { type Renderer, Ticker } from 'pixi.js';

import type { Character } from './character';
import { makeFrames } from '../makeCanvasFrame';

import { createMergedTimeline } from '@/utils/timline';
import { nextTick } from '@/utils/eventLoop';

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

export async function characterToCanvasFrames(
  character: Character,
  renderer: Renderer,
  options?: {
    backgroundColor?: string;
    padWhiteSpace?: boolean;
  },
) {
  const isOriginalAnimating = character.isAnimating;
  character.stop();
  /* hide effect except weapons effect */
  character.renderCharacter();
  character.toggleEffectVisibility(true);
  await nextTick();

  if (!character.currentInstructions) {
    throw new Error('Character body not found');
  }

  const totalFrameCount = character.currentInstructions.length;

  const resultData = await makeFrames(character, renderer, totalFrameCount, {
    backgroundColor: options?.backgroundColor,
    padWhiteSpace: options?.padWhiteSpace,
    getFrameDelay: (_) => character.currentInstruction?.delay || 100,
    beforeMakeFrame: (index) => {
      character.instructionFrame = index;
      character.playBodyFrame();
    },
    nextFrame: nextTick,
  });

  if (!isOriginalAnimating) {
    character.play();
  }

  character.toggleEffectVisibility(false);
  await nextTick();

  return resultData;
}

export async function characterToCanvasFramesWithEffects(
  character: Character,
  renderer: Renderer,
  options?: {
    backgroundColor?: string;
    padWhiteSpace?: boolean;
    frameRate?: number;
    duractionMs?: number;
    maxDurationMs?: number;
    onProgress?: (progress: number, total: number) => void;
  },
) {
  const needCalculateMaxDuration = !!options?.duractionMs || character.skill;

  const isOriginalAnimating = character.isAnimating;

  Ticker.shared.stop();
  Ticker.system.stop();
  const current = performance.now();
  Ticker.shared.update(current);

  /* reset character frame */
  character.instructionFrame = 0;
  character.currentDelta = 0;
  character.playBodyFrame();

  let { timelines, duractionMs } = generateCharacterTimeline(character);

  if (options?.maxDurationMs) {
    duractionMs = Math.min(options.maxDurationMs, duractionMs);
  }

  Ticker.shared.update(current);

  await nextTick();

  if (!character.currentInstructions) {
    throw new Error('Character body not found');
  }

  const mergedTimeline = createMergedTimeline(timelines);

  if (
    needCalculateMaxDuration &&
    mergedTimeline[mergedTimeline.length - 1] > duractionMs
  ) {
    // binary search the portion
    let start = 0;
    let end = mergedTimeline.length - 1;
    while (start !== end) {
      const mid = start + Math.floor((end - start) / 2);
      if (mergedTimeline[mid] > duractionMs) {
        end = mid;
      } else {
        start = mid + 1;
      }
    }
    // remove the timeline after the end
    mergedTimeline.splice(start);
  }

  const totalFrameCount = mergedTimeline.length;
  options?.onProgress?.(0, totalFrameCount);
  await nextTick();

  const time = performance.now();
  let add = 0;

  const resultData = await makeFrames(character, renderer, totalFrameCount, {
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

  if (!isOriginalAnimating) {
    character.play();
  }

  Ticker.shared.start();
  Ticker.system.start();

  return resultData;
}

export function generateCharacterTimeline(character: Character) {
  const timelines = [] as number[][];
  const instructionTimeline = character.currentInstructions.reduce(
    (acc, frame) => {
      const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(prev + (frame.delay ?? 100) * character.speed);
      return acc;
    },
    [] as number[],
  );

  timelines.push(instructionTimeline);

  /* reset effects frame */
  if (!character.isHideAllEffect) {
    for (const effect of character.allEffectPieces) {
      effect.currentFrame = 0;
      /* @ts-ignore */
      effect._currentTime = 0;
      timelines.push(effect.timeline);
    }
  }
  /* reset name tag frame */
  if (
    character.nameTag.visible &&
    character.nameTag.isAnimatedBackground(character.nameTag.background)
  ) {
    character.nameTag.background.resetFrame();
    timelines.push(character.nameTag.background.timeline);
  }
  /* reset medal frame */
  if (character.medal?.animation) {
    character.medal.animation.resetFrame();
    timelines.push(character.medal.animation.timeline);
  }

  let duractionMs = timelines.reduce((acc, timeline) => {
    return Math.max(acc, timeline[timeline.length - 1]);
  }, 0);

  if (character.skill) {
    character.skill.resetDelta();
    const skillTimelines = character.skill.getTimelines();
    const maxLast = skillTimelines.reduce((acc, timeline) => {
      return Math.max(acc, timeline[timeline.length - 1]);
    }, 0);
    // if has skill, force overrid the duration
    duractionMs = maxLast;
    timelines.push(...skillTimelines);
  }
  return { timelines, duractionMs };
}
