import { atom, batched } from 'nanostores';
import type { PointData } from 'pixi.js';

export const $previewZoom = atom<number>(1);
export const $previewCenter = atom<PointData>({ x: 0, y: 0 });

/** indicate current zoom or drag action target  */
export const $zoomTarget = atom<string>('');

/* computed */
export const $previewZoomInfo = batched(
  [$previewZoom, $previewCenter],
  (zoom, center) => ({
    zoom,
    center,
  }),
);

/* action */
export function updateZoom(value: number, target: string) {
  if ($zoomTarget.get() !== target) {
    $zoomTarget.set(target);
  }
  $previewZoom.set(value);
}
export function updateCenter(value: PointData, target: string) {
  if ($zoomTarget.get() !== target) {
    $zoomTarget.set(target);
  }
  $previewCenter.set(value);
}
