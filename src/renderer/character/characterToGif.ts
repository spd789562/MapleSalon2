import type { Renderer } from "pixi.js";
import { encode } from "modern-gif";
import UPNG from "@pdf-lib/upng";
// import workerUrl from 'modern-gif/worker?url';

import type { Character } from "./character";

import { extractCanvas } from "@/utils/extract";

import { CharacterAction } from "@/const/actions";

async function nextTick() {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
}

type UniversalFrame = {
  width: number;
  height: number;
  left: number;
  top: number;
  delay: number;
  canvas: HTMLCanvasElement;
};

export async function makeCharacterFrames(
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
    character.action.startsWith("stand");

  const baseFrameCount = character.currentBodyNode.frames.length;
  const totalFrameCount = needBounce ? baseFrameCount * 2 - 2 : baseFrameCount;

  const exportFrames: UniversalFrame[] = [];

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
    const frameData: UniversalFrame = {
      canvas,
      delay: currentBodyFrame.delay,
      width: canvas.width,
      height: canvas.height,
      left: -bodyPos.x,
      top: -bodyPos.y,
    };
    exportFrames.push(frameData);

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
  for (const frame of exportFrames) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    canvas.width = maxWidth;
    canvas.height = maxHeight;
    ctx.drawImage(frame.canvas, basePos.x + frame.left, basePos.y + frame.top);
    frame.width = maxWidth;
    frame.height = maxHeight;
    frame.left = 0;
    frame.top = 0;
  }

  if (!isOriginalAnimating) {
    character.play();
  }

  return { frames: exportFrames, width: maxWidth, height: maxHeight };
}

export function characterFramesToApng(
  frames: UniversalFrame[],
  options: { width: number; height: number },
) {
  return UPNG.encode(
    frames.map(({ canvas }) => {
      const ctx = canvas.getContext("2d")!;
      const buffer = ctx.getImageData(0, 0, canvas.width, canvas.height).data
        .buffer;
      return buffer;
    }),
    options.width,
    options.height,
    0,
    frames.map((frame) => frame.delay),
  );
}

export function characterFramesToGif(
  frames: UniversalFrame[],
  options: { width: number; height: number },
) {
  return encode({
    // workerUrl,
    width: options.width,
    height: options.height,
    frames: frames.map((frame) => ({
      data: frame.canvas,
      width: frame.width,
      height: frame.height,
      delay: frame.delay,
      top: 0,
      left: 0,
      disposal: 2,
    })),
    maxColors: 255,
    looped: true,
  });
}
