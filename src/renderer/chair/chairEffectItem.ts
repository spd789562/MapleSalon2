import { Assets, type Container, type UnresolvedAsset } from 'pixi.js';
import { CharacterAction } from '@/const/actions';
import type { WzActionInstruction } from '../character/const/wz';
import type { Vec2 } from './const/data';
import type { WzChairEffectItem, WzPngPieceInfo } from './const/wz';
import { ChairEffectPart } from './chairEffectPart';

export class ChairEffectItem {
  filters = [];
  name: string;
  wz: WzChairEffectItem;
  frameCount = 0;
  frames: ChairEffectPart[] = [];

  constructor(name: string, wz: WzChairEffectItem) {
    this.name = name;
    this.wz = wz;
    const keys = Object.keys(wz).map((key) => Number.parseInt(key, 10) || 0);
    this.frameCount = keys.reduce((a, b) => Math.max(a, b + 1), keys.length);

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
  async loadResourceByFrame(index: number) {
    const targetFrame = this.frames[index % this.frames.length];
    if (!targetFrame) {
      return;
    }
    const assets = targetFrame.resources?.filter(Boolean);
    assets && (await Assets.load(assets));
  }
  async loadResource() {
    const assets = this.frames
      .flatMap((part) => part.resources)
      .filter(Boolean) as UnresolvedAsset[];
    await Assets.load(assets);
  }
  removePreviousFrameParts(frame: number) {
    const previousFrame =
      this.frames[(frame + this.frames.length - 1) % this.frames.length];
    previousFrame.removeFromParent();
  }
  getFramePart(frame: number) {
    return this.frames[frame % this.frames.length];
  }
  destroy() {
    for (const part of this.frames) {
      part.destroy();
    }
  }
}
