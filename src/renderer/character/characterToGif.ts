import type { Renderer } from 'pixi.js';
import { encode, type UnencodedFrame } from 'modern-gif';
// import workerUrl from 'modern-gif/worker?url';

import type { Character } from './character';

import { extractCanvas } from '@/utils/extract';

import { CharacterAction } from '@/const/actions';

async function nextTick() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

export async function characterToGif(character: Character, renderer: Renderer) {
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

  const exportFrames: UnencodedFrame[] = [];

  for (let i = 0; i < totalFrameCount; i++) {
    const frame = i < baseFrameCount ? i : totalFrameCount - i;
    character.frame = frame;
    character.playPieces(character.currentPieces);
    const currentBodyFrame = character.currentBodyFrame;
    const canvas = extractCanvas(character, renderer) as HTMLCanvasElement;
    const bodyPos = currentBodyFrame?.ancher || { x: 0, y: 0 };
    exportFrames.push({
      data: canvas,
      // index: i,
      delay: currentBodyFrame.delay,
      width: canvas.width,
      height: canvas.height,
      left: -bodyPos.x,
      top: -bodyPos.y,
      disposal: 2,
    });

    await nextTick();
  }
  const [maxWidth, maxHeight] = exportFrames.reduce(
    ([currentWidth, currentHeight], { width, height, left, top }) => [
      Math.max(currentWidth, (width || 0) + Math.abs(left || 0)),
      Math.max(currentHeight, (height || 0) + Math.abs(top || 0)),
    ],
    [0, 0],
  );

  console.log(exportFrames, 'maxWidth', maxWidth, 'maxHeight', maxHeight);

  const output = await encode({
    // workerUrl,
    width: maxWidth,
    height: maxHeight,
    frames: exportFrames,
    maxColors: 255,
    looped: true,
  });
  if (!isOriginalAnimating) {
    character.play();
  }

  return output;
}
