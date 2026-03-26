import type { Chair } from '@/renderer/chair/chair';
import {
  ColorRange,
  HsvAdjustmentFilter,
} from '@/renderer/filter/hsvAdjustmentFilter';
import type { Skill } from '@/renderer/skill/skill';
import type { TamingMob } from '@/renderer/tamingMob/tamingMob';
import type { PreviewEffectHsv } from '@/store/previewEffectHsv';

import { applyFilterToContainer } from '@/utils/pixi';

const previewFilters = {
  chair: null as HsvAdjustmentFilter | null,
  mount: null as HsvAdjustmentFilter | null,
  skill: null as HsvAdjustmentFilter | null,
};

function getPreviewFilter(
  kind: keyof typeof previewFilters,
): HsvAdjustmentFilter {
  let f = previewFilters[kind];
  if (!f) {
    f = new HsvAdjustmentFilter();
    previewFilters[kind] = f;
  }
  return f;
}

function isDefaultPreviewHsv(state: PreviewEffectHsv): boolean {
  return (
    state.colorRange === ColorRange.All &&
    state.hue === 0 &&
    state.saturation === 0 &&
    state.brightness === 0 &&
    state.alpha === 100
  );
}

/** Match `CharacterItem.updateFilter` mapping from UI values to `HsvAdjustmentFilter`. */
export function configurePreviewHsvFilter(
  filter: HsvAdjustmentFilter,
  state: PreviewEffectHsv,
): void {
  if (isDefaultPreviewHsv(state)) {
    filter.enabled = false;
    return;
  }

  filter.enabled = true;

  filter.colorRange = state.colorRange;

  filter.hue = state.hue > 180 ? state.hue - 360 : state.hue;

  filter.saturation = state.saturation / 100;

  filter.lightness = state.brightness / 100;

  filter.alpha = state.alpha / 100;
}

export function applyPreviewHsvToChair(
  chair: Chair,
  filter: HsvAdjustmentFilter,
) {
  for (const item of chair.currentItems) {
    for (const part of item.frames) {
      const sprite = part.getRenderAble();
      applyFilterToContainer(sprite, filter);
    }
  }
  for (const tam of chair.tamingMobs) {
    if (tam) {
      applyPreviewHsvToTamingMob(tam, filter);
    }
  }
}

export function applyPreviewHsvToTamingMob(
  taming: TamingMob,
  filter: HsvAdjustmentFilter,
) {
  for (const item of taming.actionItem.values()) {
    for (const frame of item.items) {
      for (const part of frame) {
        applyFilterToContainer(part, filter);
      }
    }
  }
}

export function applyPreviewHsvToSkill(
  skill: Skill,
  filter: HsvAdjustmentFilter,
) {
  for (const item of skill.currentItems) {
    for (const part of item.frames) {
      const sprite = part.getRenderAble();
      applyFilterToContainer(sprite, filter);
    }
  }
}

export function syncChairPreviewEffectHsv(
  chair: Chair | undefined,
  state: PreviewEffectHsv,
) {
  const filter = getPreviewFilter('chair');
  configurePreviewHsvFilter(filter, state);
  if (chair) {
    applyPreviewHsvToChair(chair, filter);
  }
}

export function syncMountPreviewEffectHsv(
  taming: TamingMob | undefined,
  state: PreviewEffectHsv,
) {
  const filter = getPreviewFilter('mount');
  configurePreviewHsvFilter(filter, state);
  if (taming) {
    applyPreviewHsvToTamingMob(taming, filter);
  }
}

export function syncSkillPreviewEffectHsv(
  skill: Skill | undefined,
  state: PreviewEffectHsv,
) {
  const filter = getPreviewFilter('skill');
  configurePreviewHsvFilter(filter, state);
  if (skill) {
    applyPreviewHsvToSkill(skill, filter);
  }
}
