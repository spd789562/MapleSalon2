// use worker need to do extra canvas to arrayBuffer, not use it for now.
// import workerUrl from 'modern-gif/worker?url';

import type { UniversalFrame } from '@/renderer/character/characterToCanvasFrames';

export async function characterFramesToGif(
  frames: UniversalFrame[],
  options: { width: number; height: number },
) {
  const { encode } = await import('modern-gif');

  return encode({
    // workerUrl,
    width: options.width,
    height: options.height,
    frames: frames.map((frame) => ({
      data: frame.canvas,
      width: frame.width,
      height: frame.height,
      delay: frame.delay,
      disposal: 2,
    })),
    maxColors: 255,
    looped: true,
  });
}
