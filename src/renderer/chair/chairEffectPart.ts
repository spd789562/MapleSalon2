import {
  Assets,
  Sprite,
  Texture,
  type Container,
  type UnresolvedAsset,
} from 'pixi.js';
import type { WzPngPieceInfo } from './const/wz';
import type { ChairEffectItem } from './chairEffectItem';
import type { AnimatableFrame } from '../AnimatablePart';

import { CharacterLoader } from '../character/loader';

export class ChairEffectPart implements AnimatableFrame {
  chairEffectItem: ChairEffectItem;
  frameData: WzPngPieceInfo;
  frame: number | string;
  url?: string;
  zIndex: number;
  position: { x: number; y: number } = { x: 0, y: 0 };
  delay = 100;

  _srpite: Container | null = null;

  constructor(
    item: ChairEffectItem,
    frameData: WzPngPieceInfo,
    frame: number | string,
  ) {
    this.frame = frame;
    this.frameData = frameData;
    this.chairEffectItem = item;
    this.url = frameData._outlink || frameData.path;
    if (this.url?.startsWith('Base')) {
      this.url = this.url.replace('Base/', '');
    }
    this.position = {
      x: -frameData.origin?.x || 0,
      y: -frameData.origin?.y || 0,
    };
    this.zIndex = frameData.z || item.wz.z || 0;
    this.delay = frameData.delay || item.wz.delay || 100;
    if (
      item.bodyRelMove &&
      !item.chair.forceAction &&
      (!item.wz.pos || item.wz.pos < 2)
    ) {
      const offset = item.bodyRelMove;
      this.position.x += offset.x;
      this.position.y += offset.y - (item.wz.pos === 1 ? 50 : 0);
    }
    if (!item.bodyRelMove && item.wz.pos === 1 && !item.chair.tamingMobId) {
      this.position.y -= 50;
    }
    if (
      !item.bodyRelMove &&
      item.wz.pos === 1 &&
      item.chair.tamingMobId &&
      item.chair.id / 1000 < 3011
    ) {
      this.position.y -= 30;
    }
  }

  get resources() {
    if (!this.url) {
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
    if (!this.url) {
      return Texture.EMPTY;
    }
    return Assets.get(this.url);
  }
  getRenderAble() {
    if (this._srpite) {
      return this._srpite;
    }
    const sprite = Sprite.from(this.getTexture());
    this._srpite = sprite;
    return this._srpite;
  }
  getResource() {
    return this.resources;
  }

  async updateFrameData(frameData: WzPngPieceInfo) {
    this.frameData = frameData;
    this.url = frameData._outlink || frameData.path;
    this.position = {
      x: -frameData.origin.x,
      y: -frameData.origin.y,
    };
    await this.prepareResource();
  }
}
