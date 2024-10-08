import { type Renderer, Ticker } from 'pixi.js';

import type { Character } from './character';

import { extractCanvas } from '@/utils/extract';
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
  const frameRate = options?.frameRate || 30;
  const frameMs = 1000 / frameRate;
  let duractionMs = options?.duractionMs || 0;
  const needCalculateMaxDuration = !duractionMs;

  const isOriginalAnimating = character.isAnimating;

  Ticker.shared.stop();
  let current = performance.now();
  Ticker.shared.update(current);

  /* reset character frame */
  character.instructionFrame = 0;
  character.currentDelta = 0;
  character.playBodyFrame();
  /* reset effects frame */
  for (const effect of character.allEffectPieces) {
    effect.currentFrame = 0;
    /* @ts-ignore */
    effect._currentTime = 0;
    if (needCalculateMaxDuration && effect.totalDuration > duractionMs) {
      duractionMs = effect.totalDuration;
    }
  }
  /* reset name tag frame */
  if (
    character.nameTag.visible &&
    character.nameTag.isAnimatedBackground(character.nameTag.background)
  ) {
    character.nameTag.background.resetFrame();
    const nameTagDuration = character.nameTag.background.totalDuration;
    if (needCalculateMaxDuration && nameTagDuration > duractionMs) {
      duractionMs = nameTagDuration;
    }
  }

  if (options?.maxDurationMs) {
    duractionMs = Math.min(options.maxDurationMs, duractionMs);
  }

  Ticker.shared.update(current);

  await nextTick();

  if (!character.currentInstructions) {
    throw new Error('Character body not found');
  }

  const characterDuraction = character.currentInstructions.reduce(
    (acc, frame) => acc + (frame.delay || 100),
    0,
  );

  if (needCalculateMaxDuration && characterDuraction > duractionMs) {
    duractionMs = characterDuraction;
  }

  const totalFrameCount = Math.ceil(duractionMs / frameMs);
  options?.onProgress?.(0, totalFrameCount);
  await nextTick();

  const resultData = await makeFrames(character, renderer, totalFrameCount, {
    backgroundColor: options?.backgroundColor,
    padWhiteSpace: options?.padWhiteSpace,
    getFrameDelay: (_) => frameMs,
    afterMakeFrame: (i) => {
      options?.onProgress?.(i + 1, totalFrameCount);
      current += frameMs;
      Ticker.shared.update(current);
    },
  });

  if (!isOriginalAnimating) {
    character.play();
  }

  Ticker.shared.start();

  return resultData;
}

async function makeFrames(
  character: Character,
  renderer: Renderer,
  count: number,
  options: {
    backgroundColor?: string;
    padWhiteSpace?: boolean;
    getFrameDelay?: (index: number) => void;
    beforeMakeFrame?: (index: number) => void;
    afterMakeFrame?: (index: number) => void;
  },
): Promise<CanvasFramesData> {
  const unprocessedFrames: UnprocessedFrame[] = [];

  const bound = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  for (let i = 0; i < count; i++) {
    options.beforeMakeFrame?.(i);

    const canvas = extractCanvas(character, renderer) as HTMLCanvasElement;
    const frameBound = character.getLocalBounds();
    const frameData: UnprocessedFrame = {
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

    await nextTick();
  }

  const maxWidth = bound.right - bound.left;
  const maxHeight = bound.bottom - bound.top;

  /* add padding to canvas */
  const basePos = {
    x: -bound.left,
    y: -bound.top,
  };
  const exportFrames = unprocessedFrames.map((frame) => {
    const top = basePos.y + frame.top;
    const left = basePos.x + frame.left;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const needPad =
      options.padWhiteSpace || options.padWhiteSpace === undefined;

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
