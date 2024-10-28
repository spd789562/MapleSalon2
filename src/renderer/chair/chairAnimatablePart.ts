import { BaseAnimatablePart } from '../AnimatablePart';
import { Assets, type UnresolvedAsset } from 'pixi.js';
import type { ChairEffectItem } from './chairEffectItem';
import type { ChairEffectPart } from './chairEffectPart';

export class ChairAnimatablePart extends BaseAnimatablePart<ChairEffectPart> {
  item: ChairEffectItem;
  effectZindex?: number;

  constructor(
    item: ChairEffectItem,
    frames: ChairEffectPart[],
    effectZindex?: number,
  ) {
    super(frames);
    this.item = item;
    this.effectZindex = effectZindex;
    this.updatePositionByFrame(0);
    this.onFrameChange = this.frameChanges.bind(this);
    this.filters = this.item.filters;
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

  get firstFrameZmapLayer() {
    return this.frames[0].zIndex;
  }

  async prepareResource() {
    await Assets.load(this.resources);
  }
}
