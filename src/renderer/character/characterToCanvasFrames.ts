import { type Renderer, Ticker, Bounds, type Container } from 'pixi.js';

import type { Character } from './character';
import type { CharacterZmapContainer } from './characterZmapContainer';
import { makeFrames, toPaddedFrames } from '../makeCanvasFrame';

import { createMergedTimeline } from '@/utils/timline';
import { nextTick } from '@/utils/eventLoop';
import { extractCanvas } from '@/utils/extract';

interface UnprocessedFrame {
  name?: string;
  width: number;
  height: number;
  left: number;
  top: number;
  delay: number;
  canvas: HTMLCanvasElement;
}

export type UniversalFrame = UnprocessedFrame;
export interface CanvasFramesData {
  frames: UniversalFrame[] | UniversalFrame[][];
  width: number;
  height: number;
}

export async function characterToCanvasFrames(
  character: Character,
  renderer: Renderer,
  options?: {
    backgroundColor?: string;
    padWhiteSpace?: boolean;
    exportParts?: boolean;
  },
) {
  const isOriginalAnimating = character.isAnimating;
  character.stop();
  character.renderCharacter();
  /* not hide the effect for now, it a little werid effect not get export even it has different frame count */
  // character.toggleEffectVisibility(true);
  await nextTick();

  if (!character.currentInstructions) {
    throw new Error('Character body not found');
  }

  /* reset character frame */
  character.instructionFrame = 0;
  character.currentDelta = 0;
  character.playBodyFrame();

  Ticker.shared.stop();
  const current = performance.now();
  Ticker.shared.update(current);

  /* reset effects frame */
  if (!character.isHideAllEffect) {
    for (const effect of character.allEffectPieces) {
      effect.currentFrame = 0;
      /* @ts-ignore */
      effect._currentTime = 0;
    }
  }

  const instructions = character.currentInstructions;

  const timeline = instructions.reduce((acc, frame) => {
    const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
    acc.push(prev + (frame.delay ?? 100) * character.speed);
    return acc;
  }, [] as number[]);

  const totalFrameCount = character.currentInstructions.length;

  let add = 0;

  const getFrameDelay = (index: number) => instructions[index]?.delay ?? 100;
  const nextFrameTicker = async (index: number) => {
    while (add < timeline[index]) {
      add += 10;
      Ticker.shared.update(current + add);
    }
  };

  const resultData = options?.exportParts
    ? await makePartsFrames(character, renderer, totalFrameCount, {
        getFrameDelay,
        nextFrame: nextFrameTicker,
      })
    : await makeFrames(character, renderer, totalFrameCount, {
        backgroundColor: options?.backgroundColor,
        padWhiteSpace: options?.padWhiteSpace,
        getFrameDelay,
        nextFrame: nextFrameTicker,
      });

  if (!isOriginalAnimating) {
    character.play();
  }

  await nextTick();
  Ticker.shared.start();

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
    exportParts?: boolean;
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

  const getFrameDelay = (index: number) =>
    mergedTimeline[index] - (index === 0 ? 0 : mergedTimeline[index - 1]);
  const afterMakeFrame = (index: number) => {
    options?.onProgress?.(index + 1, totalFrameCount);
  };
  const nextFrame = async (index: number) => {
    while (add < mergedTimeline[index]) {
      add += 16.66667;
      Ticker.shared.update(time + add);
      await nextTick();
    }
  };
  const resultData = options?.exportParts
    ? await makePartsFrames(character, renderer, totalFrameCount, {
        getFrameDelay,
        afterMakeFrame,
        nextFrame,
      })
    : await makeFrames(character, renderer, totalFrameCount, {
        backgroundColor: options?.backgroundColor,
        padWhiteSpace: options?.padWhiteSpace,
        getFrameDelay,
        afterMakeFrame,
        nextFrame,
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
  /* reset nickTag frame */
  if (character.nickTag?.animation) {
    character.nickTag.animation.resetFrame();
    timelines.push(character.nickTag.animation.timeline);
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

export async function makePartsFrames(
  character: Character,
  renderer: Renderer,
  count: number,
  options: {
    getFrameDelay?: (index: number) => number;
    beforeMakeFrame?: (index: number) => void;
    afterMakeFrame?: (index: number) => void;
    nextFrame: (index: number) => Promise<void>;
  },
): Promise<CanvasFramesData> {
  const unprocessedFrames: UniversalFrame[][] = [];

  const bound = new Bounds();

  for (let i = 0; i < count; i++) {
    options.beforeMakeFrame?.(i);
    const delay = options.getFrameDelay?.(i) || 100;
    const frameBound = character.getLocalBounds();
    bound.addBounds(frameBound);

    unprocessedFrames.push(generatePartsFrame(character, renderer, { delay }));

    options.afterMakeFrame?.(i);

    await options.nextFrame(i);
  }

  const maxWidth = bound.right - bound.left;
  const maxHeight = bound.bottom - bound.top;

  const exportFrames = unprocessedFrames.map(
    (frames) => toPaddedFrames(frames, bound).frames,
  );

  return {
    frames: exportFrames,
    width: maxWidth,
    height: maxHeight,
  };
}

export function generatePartsFrame(
  character: Character,
  renderer: Renderer,
  options?: {
    delay?: number;
  },
): UniversalFrame[] {
  const frameParts: UniversalFrame[] = [];
  const delay = options?.delay ?? 100;
  for (const layer of character.bodyFrame.children) {
    if (!layer.visible || layer.children.length === 0) {
      continue;
    }
    const bound = layer.getLocalBounds();
    const canvas = extractCanvas(layer, renderer) as HTMLCanvasElement;
    const frameData: UniversalFrame = {
      name: layer.name
        ? `${layer.name}_${(layer as CharacterZmapContainer)._originzIndex}`
        : 'effect',
      canvas,
      delay,
      width: canvas.width,
      height: canvas.height,
      left: -(bound.left - character.bodyFrame.pivot.x),
      top: -(bound.top - character.bodyFrame.pivot.y),
    };
    frameParts.push(frameData);
  }
  const others = [
    [character.nameTag, 'nameTag'],
    [character.chatBalloon, 'chatBalloon'],
    [character.medal, 'medal'],
    [character.nickTag, 'nickTag'],
  ] as [Container, string][];
  for (const [part, name] of others) {
    if (!part || !part.visible) {
      continue;
    }
    const bound = part.getLocalBounds();
    const canvas = extractCanvas(part, renderer) as HTMLCanvasElement;
    const frameData: UniversalFrame = {
      name,
      canvas,
      delay,
      width: canvas.width,
      height: canvas.height,
      left: -(bound.left + part.position.x - part.pivot.x),
      top: -(bound.top + part.position.y - part.pivot.y),
    };
    frameParts.push(frameData);
  }

  return frameParts;
}
