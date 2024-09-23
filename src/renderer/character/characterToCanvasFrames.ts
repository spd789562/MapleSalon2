import type { Renderer } from 'pixi.js';

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

export type UniversalFrame = Omit<UnprocessedFrame, 'left' | 'top'>;
export interface CanvasFramesData {
  frames: UniversalFrame[];
  width: number;
  height: number;
}

export async function characterToCanvasFrames(
  character: Character,
  renderer: Renderer,
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

  const unprocessedFrames: UnprocessedFrame[] = [];

  const bound = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  for (let i = 0; i < totalFrameCount; i++) {
    const frame = i;
    character.instructionFrame = frame;
    character.playBodyFrame();
    const canvas = extractCanvas(character, renderer) as HTMLCanvasElement;
    const frameBound = character.getLocalBounds();
    const frameData: UnprocessedFrame = {
      canvas,
      delay: character.currentInstruction?.delay || 100,
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
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    ctx.drawImage(frame.canvas, basePos.x + frame.left, basePos.y + frame.top);
    return {
      canvas,
      delay: frame.delay,
      width: canvas.width,
      height: canvas.height,
    };
  });

  if (!isOriginalAnimating) {
    character.play();
  }

  character.toggleEffectVisibility(false);
  await nextTick();

  return {
    frames: exportFrames,
    width: maxWidth,
    height: maxHeight,
  };
}
