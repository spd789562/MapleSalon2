import { Assets, type UnresolvedAsset } from 'pixi.js';
import type { CharacterAction } from '@/const/actions';
import type { WzActionInstruction } from '../character/const/wz';
import type { WzTamingMobFrameItem } from './const/wz';
import type { TamingMob } from './tamingMob';
import { TamingMobPart } from './tamingMobPart';

export class TamingMobItem {
  filters = [];
  name: CharacterAction;
  wz: Record<number, WzTamingMobFrameItem>;
  tamimgMob: TamingMob;
  frameCount = 0;
  items: TamingMobPart[][] = [];
  instructions: WzActionInstruction[] = [];

  constructor(
    name: CharacterAction,
    wz: Record<number, WzTamingMobFrameItem>,
    tamimgMob: TamingMob,
  ) {
    this.name = name;
    this.wz = wz;
    this.tamimgMob = tamimgMob;
    const keys = Object.keys(wz).map((key) => Number.parseInt(key, 10) || 0);
    this.frameCount = keys.reduce((a, b) => Math.max(a, b + 1), keys.length);

    this.resolveFrames();
  }
  resolveFrames() {
    const items: TamingMobPart[][] = [];
    const instructions: WzActionInstruction[] = [];

    for (let frame = 0; frame < this.frameCount; frame++) {
      const layerItems = [] as TamingMobPart[];
      const item = this.wz[frame];
      const instruction = {
        action: item.forceCharacterAction || this.name,
        frame: item.forceCharacterActionFrameIndex || 0,
        expression: item.forceCharacterFace,
        expressionFrame: item.forceCharacterFaceFrameIndex,
        flip: item.forceCharacterFlip,
        delay: item.delay || 100,
      } as WzActionInstruction;
      instructions.push(instruction);

      const layers = Object.keys(item)
        .map((key) => Number.parseInt(key, 10))
        .filter((key) => !Number.isNaN(key));

      for (const layer of layers) {
        layerItems.push(new TamingMobPart(this, item[layer], frame));
      }
      items.push(layerItems);
    }

    this.instructions = instructions;
    this.items = items;
  }
  async loadResourceByFrame(index: number) {
    const targetFrame = this.items[index % this.items.length];
    if (!targetFrame) {
      return;
    }
    const assets = targetFrame
      .flatMap((part) => part.resources)
      .filter(Boolean) as UnresolvedAsset[];
    await Assets.load(assets);
    for (const part of targetFrame) {
      part.refreshView();
    }
  }
  async loadResource() {
    const assets = this.items
      .flatMap((frame) => frame.flatMap((part) => part.resources))
      .filter(Boolean) as UnresolvedAsset[];
    await Assets.load(assets);
    for (const frame of this.items) {
      for (const part of frame) {
        part.refreshView();
      }
    }
  }
  destroy() {
    for (const frame of this.items) {
      for (const part of frame) {
        part.destroy();
      }
    }
  }
}
