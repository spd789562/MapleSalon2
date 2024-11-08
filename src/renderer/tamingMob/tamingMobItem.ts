import { Assets, type UnresolvedAsset } from 'pixi.js';
import { CharacterAction } from '@/const/actions';
import type { WzActionInstruction } from '../character/const/wz';
import type { Vec2 } from './const/data';
import type { WzPngPieceInfo, WzTamingMobFrameItem } from './const/wz';
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
  navels: Vec2[] = [];
  defaultAction = CharacterAction.Sit;

  constructor(
    name: CharacterAction,
    wz: Record<number, WzTamingMobFrameItem>,
    tamimgMob: TamingMob,
    defaultAction?: CharacterAction,
  ) {
    this.name = name;
    this.wz = wz;
    this.tamimgMob = tamimgMob;
    const keys = Object.keys(wz).map((key) => Number.parseInt(key, 10) || 0);
    this.frameCount = keys.reduce((a, b) => Math.max(a, b + 1), keys.length);
    if (defaultAction) {
      this.defaultAction = defaultAction;
    }

    this.resolveFrames();
  }
  get isAncherForChair() {
    const firstFrame = this.wz?.[0]?.[0];
    return firstFrame?.width === 4;
  }

  resolveFrames() {
    const navels: Vec2[] = [];
    const items: TamingMobPart[][] = [];
    const instructions: WzActionInstruction[] = [];

    for (let frame = 0; frame < this.frameCount; frame++) {
      const layerItems = [] as TamingMobPart[];
      const item = this.wz[frame];
      let navel = { x: 0, y: 0 };
      const instruction = {
        action: item.forceCharacterAction || this.defaultAction,
        frame: item.forceCharacterActionFrameIndex || 0,
        expression: item.forceCharacterFace,
        expressionFrame: item.forceCharacterFaceFrameIndex,
        flip: item.forceCharacterFlip,
        delay:
          item.delay || (this.wz as unknown as { delay?: number }).delay || 100,
      } as WzActionInstruction;

      if ((instruction.action as unknown as string) === 'stand') {
        instruction.action = CharacterAction.Stand1;
      }

      instructions.push(instruction);

      for (const layer of Object.keys(item)) {
        if (
          Number.isNaN(Number(layer)) &&
          layer !== 'tamingMobRear' &&
          layer !== 'tamingMobFront'
        ) {
          continue;
        }
        const layerData = item[layer as keyof typeof item] as WzPngPieceInfo;

        if (layerData.map?.navel) {
          navel = {
            x: layerData.map.navel.x,
            y: layerData.map.navel.y,
          };
        }

        layerItems.push(new TamingMobPart(this, layerData, frame));
      }
      navels.push(navel);
      items.push(layerItems);
    }

    this.navels = navels;
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
  removePreviousFrameParts(frame: number) {
    const previousFrame =
      this.items[(frame + this.items.length - 1) % this.items.length];
    for (const part of previousFrame) {
      part.removeFromParent();
    }
  }
  getFrameParts(frame: number) {
    return this.items[frame % this.items.length];
  }
  getFrameNavel(frame: number) {
    return this.navels[frame % this.navels.length];
  }
  destroy() {
    for (const frame of this.items) {
      for (const part of frame) {
        part.destroy();
      }
    }
  }
}
