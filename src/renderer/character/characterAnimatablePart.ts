import { BaseAnimatablePart } from '../AnimatablePart';
import { Assets, ColorMatrixFilter, type UnresolvedAsset } from 'pixi.js';
import type { CharacterItemPiece } from './itemPiece';
import type { CharacterItem } from './item';

export class CharacterAnimatablePart extends BaseAnimatablePart<CharacterItemPiece> {
  item: CharacterItem;

  colorFilter?: ColorMatrixFilter;

  constructor(item: CharacterItem, frames: CharacterItemPiece[]) {
    super(frames);
    this.item = item;
    this.updatePositionByFrame(0);
    this.onFrameChange = this.frameChanges.bind(this);
    this.updateFilter();
  }

  updateFilter() {
    const colorFilter = this.colorFilter || new ColorMatrixFilter();

    this.colorFilter?.reset();

    if (this.item.info.brightness !== undefined) {
      colorFilter.brightness(this.item.info.brightness, true);
    }
    if (this.item.info.contrast !== undefined) {
      colorFilter.contrast(this.item.info.contrast, true);
    }
    if (this.item.info.saturation !== undefined) {
      colorFilter.saturate(this.item.info.saturation, true);
    }
    if (this.item.info.hue !== undefined) {
      colorFilter.hue(this.item.info.hue, true);
    }

    if (this.colorFilter !== colorFilter) {
      this.filters = colorFilter;
      this.colorFilter = colorFilter;
    }
  }

  updatePositionByFrame(currentFrame: number) {
    this.position.copyFrom(this.frames[currentFrame].position);
  }
  frameChanges(currentFrame: number) {
    this.updatePositionByFrame(currentFrame);
  }
  get resources() {
    return this.frames
      .flatMap((frame) => frame.getResource())
      .filter((r) => r) as UnresolvedAsset[];
  }

  get isAllAncherBuilt() {
    return !this.frames.some((frame) => !frame.isAncherBuilt);
  }

  /** check this part has own delay and frame is all not joint to other pieces */
  get canIndependentlyPlay() {
    return this.frames.every((frame) => frame.isIndepened && frame.delay > 0);
  }

  async prepareResource() {
    await Assets.load(this.resources);
  }
}
