import { atom, batched } from 'nanostores';
import type { PointData } from 'pixi.js';

export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 3;
export const DEFAULT_ZOOM = 1;

export const DEFAULT_CENTER: PointData = { x: 0, y: -53 };

export const $previewZoom = atom<number>(DEFAULT_ZOOM);
export const $previewCenter = atom<PointData>(DEFAULT_CENTER);

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
export function updateTargetIfNeeded(target: string) {
  if ($zoomTarget.get() !== target) {
    $zoomTarget.set(target);
  }
}
export function updateZoom(value: number, target: string) {
  updateTargetIfNeeded(target);
  $previewZoom.set(value);
}
export function updateCenter(value: PointData, target: string) {
  updateTargetIfNeeded(target);
  $previewCenter.set(value);
}
export function addZoom(value: number) {
  updateTargetIfNeeded('system');
  const updateValue = $previewZoom.get() + value;
  $previewZoom.set(Math.min(MAX_ZOOM, updateValue));
}
export function subtractZoom(value: number) {
  updateTargetIfNeeded('system');
  const updateValue = $previewZoom.get() - value;
  $previewZoom.set(Math.max(MIN_ZOOM, updateValue));
}
export function resetZoom() {
  updateTargetIfNeeded('system');
  $previewZoom.set(DEFAULT_ZOOM);
}
export function resetCenter() {
  updateTargetIfNeeded('system');
  $previewCenter.set(DEFAULT_CENTER);
}
