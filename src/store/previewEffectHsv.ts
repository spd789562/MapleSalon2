import { atom } from 'nanostores';

import { ColorRange } from '@/renderer/filter/hsvAdjustmentFilter';

export interface PreviewEffectHsv {
  colorRange: ColorRange;
  hue: number;
  saturation: number;
  brightness: number;
  alpha: number;
}

export const DEFAULT_PREVIEW_EFFECT_HSV: PreviewEffectHsv = {
  colorRange: ColorRange.All,
  hue: 0,
  saturation: 0,
  brightness: 0,
  alpha: 100,
};

export const $previewChairEffectHsv = atom<PreviewEffectHsv>({
  ...DEFAULT_PREVIEW_EFFECT_HSV,
});
export const $previewMountEffectHsv = atom<PreviewEffectHsv>({
  ...DEFAULT_PREVIEW_EFFECT_HSV,
});
export const $previewSkillEffectHsv = atom<PreviewEffectHsv>({
  ...DEFAULT_PREVIEW_EFFECT_HSV,
});

export function setPreviewChairEffectHsvField(
  field: keyof PreviewEffectHsv,
  value: number,
) {
  const prev = $previewChairEffectHsv.get();
  $previewChairEffectHsv.set({ ...prev, [field]: value });
}
export function setPreviewMountEffectHsvField(
  field: keyof PreviewEffectHsv,
  value: number,
) {
  const prev = $previewMountEffectHsv.get();
  $previewMountEffectHsv.set({ ...prev, [field]: value });
}
export function setPreviewSkillEffectHsvField(
  field: keyof PreviewEffectHsv,
  value: number,
) {
  const prev = $previewSkillEffectHsv.get();
  $previewSkillEffectHsv.set({ ...prev, [field]: value });
}

export function resetPreviewChairEffectHsv() {
  $previewChairEffectHsv.set({ ...DEFAULT_PREVIEW_EFFECT_HSV });
}
export function resetPreviewMountEffectHsv() {
  $previewMountEffectHsv.set({ ...DEFAULT_PREVIEW_EFFECT_HSV });
}
export function resetPreviewSkillEffectHsv() {
  $previewSkillEffectHsv.set({ ...DEFAULT_PREVIEW_EFFECT_HSV });
}

export function batchRandomPreviewEffectHsv(
  store: 'chair' | 'mount' | 'skill',
  fields: Partial<Pick<PreviewEffectHsv, 'hue' | 'saturation' | 'brightness'>>,
) {
  const data = {
    hue: fields.hue ?? 0,
    saturation: fields.saturation ?? 0,
    brightness: fields.brightness ?? 0,
  };
  if (store === 'chair') {
    const prev = $previewChairEffectHsv.get();
    $previewChairEffectHsv.set({ ...prev, ...data });
  } else if (store === 'mount') {
    const prev = $previewMountEffectHsv.get();
    $previewMountEffectHsv.set({ ...prev, ...data });
  } else {
    const prev = $previewSkillEffectHsv.get();
    $previewSkillEffectHsv.set({ ...prev, ...data });
  }
}
