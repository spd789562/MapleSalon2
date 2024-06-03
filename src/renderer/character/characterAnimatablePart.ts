import { BaseAnimatablePart } from '../AnimatablePart';
import { Assets, type UnresolvedAsset } from 'pixi.js';
import type { CharacterItemPiece } from './itemPiece';

export class CharacterAnimatablePart extends BaseAnimatablePart<CharacterItemPiece> {
  constructor(frames: CharacterItemPiece[]) {
    super(frames);
    this.updatePositionByFrame(0);
    this.onFrameChange = this.frameChanges.bind(this);
  }

  updatePositionByFrame(currentFrame: number) {
    this.position.copyFrom(this.frames[currentFrame].position);
  }
  frameChanges(currentFrame: number) {
    this.updatePositionByFrame(currentFrame);
  }

  get resources() {
    return this.frames
      .map((frame) => frame.getResource())
      .filter((r) => r) as UnresolvedAsset[];
  }

  get isAllAncherBuilt() {
    return !this.frames.some((frame) => !frame.isAncherBuilt);
  }

  get canIndependentlyPlay() {
    return this.frames.every((frame) => frame.isIndepened && frame.delay > 0);
  }

  async prepareResource() {
    await Assets.load(this.resources);
  }
}
