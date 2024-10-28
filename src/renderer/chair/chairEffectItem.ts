import type { WzChairEffectItem } from './const/wz';
import { ChairEffectPart } from './chairEffectPart';
import { ChairAnimatablePart } from './chairAnimatablePart';

export class ChairEffectItem {
  filters = [];
  name: string;
  wz: WzChairEffectItem;
  frameCount = 0;
  frames: ChairEffectPart[] = [];
  animatablePart: ChairAnimatablePart | null = null;

  constructor(name: string, wz: WzChairEffectItem) {
    this.name = name;
    this.wz = wz;
    const keys = Object.keys(wz).map((key) => Number.parseInt(key, 10) || 0);
    this.frameCount = keys.reduce((a, b) => Math.max(a, b + 1), 0);

    this.resolveFrames();
  }
  resolveFrames() {
    const frames: ChairEffectPart[] = [];

    for (let frame = 0; frame < this.frameCount; frame++) {
      const item = this.wz[frame];

      frames.push(new ChairEffectPart(this, item, frame));
    }
    this.frames = frames;
  }
  prepareResource() {
    this.animatablePart = new ChairAnimatablePart(this, this.frames, this.wz.z);
  }
  destroy() {
    this.animatablePart?.destroy();
  }
}
