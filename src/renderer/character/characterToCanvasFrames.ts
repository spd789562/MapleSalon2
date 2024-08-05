import type { Renderer } from 'pixi.js';

import type { Character } from './character';

import { extractCanvas } from '@/utils/extract';
import { nextTick } from '@/utils/eventLoop';

import { CharacterAction } from '@/const/actions';

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
  character.render();
  character.toggleEffectVisibility(true, false);
  await nextTick();

  const needBounce =
    character.action === CharacterAction.Alert ||
    character.action.startsWith('stand');

  const baseFrameCount = character.currentBodyNode.frames.length;
  const totalFrameCount = needBounce ? baseFrameCount * 2 - 2 : baseFrameCount;

  const unprocessedFrames: UnprocessedFrame[] = [];

  const bound = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  };

  for (let i = 0; i < totalFrameCount; i++) {
    const frame = i < baseFrameCount ? i : totalFrameCount - i;
    character.frame = frame;
    character.playPieces(character.currentPieces);
    const currentBodyFrame = character.currentBodyFrame;
    const canvas = extractCanvas(character, renderer) as HTMLCanvasElement;
    const bodyPos = currentBodyFrame?.ancher || { x: 0, y: 0 };
    const frameData: UnprocessedFrame = {
      canvas,
      delay: currentBodyFrame.delay,
      width: canvas.width,
      height: canvas.height,
      left: -bodyPos.x,
      top: -bodyPos.y,
    };
    unprocessedFrames.push(frameData);

    bound.left = Math.min(bound.left, -bodyPos.x);
    bound.top = Math.min(bound.top, -bodyPos.y);
    bound.right = Math.max(bound.right, canvas.width - bodyPos.x);
    bound.bottom = Math.max(bound.bottom, canvas.height - bodyPos.y);

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

  character.toggleEffectVisibility(false, false);
  await nextTick();

  return {
    frames: exportFrames,
    width: maxWidth,
    height: maxHeight,
  };
}
