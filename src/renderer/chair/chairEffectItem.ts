import type { WzChairEffectItem, WzPngPieceInfo } from './const/wz';
import type { Chair } from './chair';
import { ChairEffectPart } from './chairEffectPart';
import { ChairAnimatablePart } from './chairAnimatablePart';

export class ChairEffectItem {
  filters = [];
  name: string;
  wz: WzChairEffectItem;
  frameCount = 0;
  frames: ChairEffectPart[] = [];
  animatablePart: ChairAnimatablePart | null = null;
  chair: Chair;
  frameKeys: string[] = [];

  constructor(name: string, wz: WzChairEffectItem, chair: Chair) {
    this.name = name;
    this.wz = wz;
    const keys = Object.keys(wz).filter((key) => Number.isInteger(Number(key)));
    keys.sort((a, b) => Number(a) - Number(b));
    this.frameKeys = keys;
    this.frameCount = keys.reduce(
      (a, b) => Math.max(Number(a), Number(b) + 1),
      0,
    );
    this.chair = chair;

    this.resolveFrames();
  }
  resolveFrames() {
    const frames: ChairEffectPart[] = [];

    for (const frame of this.frameKeys) {
      const item = this.wz[frame as keyof WzChairEffectItem] as WzPngPieceInfo;

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
