import { BaseAnimatablePart } from '../AnimatablePart';
import { Assets, type UnresolvedAsset } from 'pixi.js';
import type { SkillItem } from './skillItem';
import type { SkillPart } from './skillPart';

export class SkillAnimatablePart extends BaseAnimatablePart<SkillPart> {
  item: SkillItem;

  constructor(item: SkillItem, frames: SkillPart[]) {
    super(frames);
    this.item = item;
    this.updatePositionByFrame(0);
    this.onFrameChange = this.frameChanges.bind(this);
    this.onComplete = this.complete.bind(this);
    this.filters = this.item.filters;
    this.zIndex = this.firstFrameZmapLayer;
    this.loop = false;
  }

  updatePositionByFrame(currentFrame: number) {
    this.position.copyFrom(this.frames[currentFrame].position);
  }
  frameChanges(currentFrame: number) {
    this.updatePositionByFrame(currentFrame);
  }
  complete() {
    const character = this.item.skill.character;
    const lastInstructionFrame = character?.currentInstructions.length || 1;
    if (character && character.instructionFrame !== lastInstructionFrame - 1) {
      this.visible = false;
      this.currentFrame = 0;
      /* @ts-ignore */
      this._updateFrame();
    }
  }
  get timeline() {
    return this.frames.reduce((acc, frame) => {
      const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(prev + frame.delay * this.animationSpeed);
      return acc;
    }, [] as number[]);
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
