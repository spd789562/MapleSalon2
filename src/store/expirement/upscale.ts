import { atom } from 'nanostores';

export const $upscaleSource = atom<HTMLCanvasElement | null>(null);

export function setUpscaleSource(canvas: HTMLCanvasElement | null) {
  $upscaleSource.set(canvas);
}
export function resetUpscaleSource() {
  $upscaleSource.set(null);
}
