import {
  Assets,
  Sprite,
  Texture,
  type Container,
  type UnresolvedAsset,
} from 'pixi.js';
import type { WzPngPieceInfo } from './const/wz';
import type { SkillItem } from './skillItem';
import type { Vec2 } from './const/data';
import type { AnimatableFrame } from '../AnimatablePart';

import { CharacterLoader } from '../character/loader';

export class SkillPart implements AnimatableFrame {
  skillItem: SkillItem;
  frameData: WzPngPieceInfo;
  frame: number;
  url?: string;
  position: Vec2 = { x: 0, y: 0 };
  zIndex = 0;
  delay = 100;

  _srpite: Container | null = null;
  isMainNavel = false;
  isEmpty = false;

  constructor(item: SkillItem, frameData: WzPngPieceInfo, frame: number) {
    this.frame = frame;
    this.frameData = frameData;
    this.skillItem = item;
    this.url = frameData._outlink || frameData.path;
    this.position = {
      x: -frameData.origin?.x,
      y: -frameData.origin?.y,
    };
    this.isEmpty =
      !!frameData.path && frameData.width === 1 && frameData.height === 1;
    this.zIndex = frameData.z || 0;
    this.delay = frameData.delay || 100;
  }

  get resources() {
    if (!this.url || this.isEmpty) {
      return null;
    }
    return [
      {
        alias: this.url,
        src: CharacterLoader.getPieceUrl(this.url),
        loadParser: 'loadTextures',
        format: '.webp',
      } as UnresolvedAsset,
    ];
  }

  async prepareResource() {
    const resouces = this.resources;
    resouces && (await Assets.load(resouces));
  }

  getTexture() {
    if (!this.url || this.isEmpty) {
      return Texture.EMPTY;
    }
    return Assets.get(this.url);
  }
  getRenderAble() {
    if (this._srpite) {
      return this._srpite;
    }
    const sprite = new Sprite(this.getTexture());
    // sprite.anchor.set(1, 1); // not sure it right to do
    this._srpite = sprite;
    return this._srpite;
  }
  getResource() {
    return this.resources;
  }
}
