import { invoke } from '@tauri-apps/api/core';
import type { UniversalFrame } from '@/renderer/character/characterToCanvasFrames';

// the data layout [width:u32, height:u32, frame_count:u32, (dealy:u32, frame_len:u32, frame_lens of data)*]
export async function characterFramesToWebpTauri(
  frames: UniversalFrame[],
  options: { width: number; height: number },
) {
  const datas = frames.map(({ canvas, delay }) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Canvas context is null');
    }
    const buffer = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    canvas.remove();
    return {
      /* it actually Uint8ClampedArray but need to force cast here */
      data: buffer as unknown as Uint8Array,
      duration: delay,
    };
  });
  const dataLength = datas.reduce((acc, frame) => {
    return acc + frame.data.length + 4 + 4;
  }, 12);
  const binary = new Uint8Array(dataLength);
  binary.set(intToUint8Array(options.width), 0);
  binary.set(intToUint8Array(options.height), 4);
  binary.set(intToUint8Array(datas.length), 8);
  let offset = 12;
  for (const data of datas) {
    const frameLength = data.data.length; // u64
    binary.set(intToUint8Array(data.duration), offset);
    binary.set(intToUint8Array(frameLength), offset + 4);
    binary.set(data.data, offset + 8);
    offset += 8 + frameLength;
  }
  console.info('send binary mb:', binary.length / 1024 / 1024);

  // return invoke<Uint8Array>('encode_webp', binary);
  return invoke<Uint8Array>('encode_webp', new Uint8Array(1024 * 1024 * 800));
}

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
      canvas.remove();
      return {
        /* it actually Uint8ClampedArray but need to force cast here */
        data: buffer as unknown as Uint8Array,
        duration: delay,
      };
    }),
  );
}

function intToUint8Array(i: number) {
  return Uint8Array.of(
    (i & 0xff) >> 0,
    (i & 0xff00) >> 8,
    (i & 0xff0000) >> 16,
    (i & 0xff000000) >> 24,
  );
}
