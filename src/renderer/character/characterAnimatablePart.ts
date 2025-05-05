import { BaseAnimatablePart } from '../AnimatablePart';
import { Assets, type UnresolvedAsset } from 'pixi.js';
import type { CharacterItemPiece } from './itemPiece';
import type { CharacterItem } from './item';

export class CharacterAnimatablePart extends BaseAnimatablePart<CharacterItemPiece> {
  item: CharacterItem;
  effectZindex?: number;

  constructor(
    item: CharacterItem,
    frames: CharacterItemPiece[],
    effectZindex?: number,
  ) {
    super(frames);
    this.item = item;
    this.effectZindex = effectZindex;
    this.updatePositionByFrame(0);
    this.onFrameChange = this.frameChanges.bind(this);
    this.filters = this.item.filters;
    this.visible = item.info.visibleEffect ?? true;
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

  get firstFrameZmapLayer() {
    return this.frames[0].z;
  }

  get timeline() {
    return this.frames.reduce((acc, frame) => {
      const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(prev + frame.delay);
      return acc;
    }, [] as number[]);
  }
  async prepareResource() {
    await Assets.load(this.resources);
  }
}
