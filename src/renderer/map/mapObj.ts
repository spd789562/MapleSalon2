import {
  AnimatedSprite,
  Assets,
  Sprite,
  type UnresolvedAsset,
  Container,
} from 'pixi.js';

import type { WzMapObjData, WzMapObjInfo, WzPngPieceInfo } from './const/wz';
import { CharacterLoader } from '../character/loader';
import { type SkeletonData, Spine } from '@esotericsoftware/spine-pixi-v8';
import { compositezIndex } from '../uniqZindex';

export class MapObj extends Container {
  info: WzMapObjInfo;
  wz: WzMapObjData;
  frames: [string, number][] = [];
  renderObj: Sprite | AnimatedSprite | Spine | null = null;
  skeletonData?: SkeletonData;
  constructor(info: WzMapObjInfo, wz: WzMapObjData, id: number) {
    super();
    this.info = info;
    this.wz = wz;
    const numberKeys = Object.keys(wz).map(Number).filter(Number.isInteger);
    numberKeys.sort((a, b) => a - b);
    for (const key of numberKeys) {
      const obj = wz[key] as unknown as WzPngPieceInfo;
      if (!obj) {
        continue;
      }
      this.frames.push([obj._outlink || obj.path || '', obj.delay || 100]);
    }
    this.position.set(info.x ?? 0, info.y ?? 0);
    this.zIndex = compositezIndex(info.z ?? 0, id);
    this.scale.x = info.f === 1 ? -1 : 1;
  }
  get resources() {
    return this.frames.map((frame) => {
      return {
        alias: frame[0],
        src: CharacterLoader.getPieceUrl(frame[0]),
        loadParser: 'loadTextures',
        format: '.webp',
      } as UnresolvedAsset;
    });
  }
  prepareResource() {
    if (this.frames.length < 2 && !this.skeletonData) {
      this.renderObj = Sprite.from(this.frames[0][0]);
      this.renderObj.pivot.set(
        this.wz[0]?.origin?.x || 0,
        this.wz[0]?.origin?.y || 0,
      );
    } else if (this.skeletonData) {
      const spine = new Spine(this.skeletonData);
      if (this.info.spineAni) {
        spine.state.setAnimation(0, this.info.spineAni, true);
      }
      this.renderObj = spine;
    } else {
      const sprite = new AnimatedSprite(
        this.frames.map((frame) => ({
          texture: Assets.get(frame[0]),
          time: frame[1],
        })),
      );
      sprite.onFrameChange = (frame) => {
        sprite.pivot.set(
          this.wz[frame]?.origin?.x || 0,
          this.wz[frame]?.origin?.y || 0,
        );
      };
      sprite.onFrameChange(0);
      sprite.play();
      this.renderObj = sprite;
    }
    this.addChild(this.renderObj);
  }
}
