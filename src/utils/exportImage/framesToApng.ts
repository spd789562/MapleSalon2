import type { UniversalFrame } from '@/renderer/character/characterToCanvasFrames';

export async function characterFramesToApng(
  frames: UniversalFrame[],
  options: { width: number; height: number },
) {
  const {
    default: { encode },
  } = await import('@pdf-lib/upng');

  return encode(
    frames.map(({ canvas }) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context is null');
      }
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
