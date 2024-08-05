import type { UniversalFrame } from '@/renderer/character/characterToCanvasFrames';

export async function characterFramesToWebp(
  frames: UniversalFrame[],
  options: { width: number; height: number },
) {
  const { encodeAnimation } = await import('wasm-webp');

  return encodeAnimation(
    options.width,
    options.height,
    true,
    frames.map(({ canvas, delay }) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Canvas context is null');
      }
      const buffer = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
      return {
        /* it actually Uint8ClampedArray but need to force cast here */
        data: buffer as unknown as Uint8Array,
        duration: delay,
      };
    }),
  );
}
