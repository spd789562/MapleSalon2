import type { Filter } from 'pixi.js';
import type { WzSkillPngSet } from './const/wz';
import type { Skill } from './skill';
import { SkillPart } from './skillPart';
import { SkillAnimatablePart } from './skillAnimatablePart';

export class SkillItem {
  filters: Filter[] = [];
  name: string;
  subName: string;
  wz: WzSkillPngSet;
  skill: Skill;
  frameCount = 0;
  frames: SkillPart[] = [];
  animatablePart?: SkillAnimatablePart;

  constructor(name: string, wz: WzSkillPngSet, skill: Skill, subName = '') {
    this.name = name;
    this.subName = subName;
    this.wz = wz;
    this.skill = skill;
    const keys = Object.keys(wz).map((key) => Number.parseInt(key, 10) || 0);
    this.frameCount = keys.reduce((a, b) => Math.max(a, b + 1), keys.length);
    this.resolveFrames();
  }
  resolveFrames() {
    const frames: SkillPart[] = [];
    for (let frame = 0; frame < this.frameCount; frame++) {
      const item = this.wz[frame];
      if (!item) {
        continue;
      }
      const part = new SkillPart(this, item, frame);
      frames.push(part);
    }
    this.frames = frames;
  }
  prepareResource() {
    this.animatablePart = new SkillAnimatablePart(this, this.frames);
  }

  destroy() {
    this.animatablePart?.destroy();
  }
}
