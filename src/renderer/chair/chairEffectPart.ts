import {
  Assets,
  Sprite,
  Texture,
  Container,
  type UnresolvedAsset,
} from 'pixi.js';
import type { WzPngPieceInfo } from './const/wz';
import type { ChairEffectItem } from './chairEffectItem';
import type { Vec2 } from './const/data';

import { CharacterLoader } from '../character/loader';

export class ChairEffectPart extends Container {
  chairEffectItem: ChairEffectItem;
  frameData: WzPngPieceInfo;
  frame: number;
  url?: string;
  z: number;
  offset: { x: number; y: number } = { x: 0, y: 0 };

  _srpite: Container | null = null;

  constructor(item: ChairEffectItem, frameData: WzPngPieceInfo, frame: number) {
    super();
    this.frame = frame;
    this.frameData = frameData;
    this.chairEffectItem = item;
    this.filters = item.filters;
    this.url = frameData._outlink || frameData.path;
    this.offset = {
      x: -frameData.origin.x,
      y: -frameData.origin.y,
    };
    this.z = frameData.z || item.wz.z || 0;
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
    const sprite = new Sprite(this.getTexture());
    // sprite.anchor.set(1, 1); // not sure it right to do
    this._srpite = sprite;
    return this._srpite;
  }
  refreshView() {
    this.removeChildren();
    this.addChild(this.getRenderAble());
  }
  updateAncher(navel: Vec2) {
    /* not sure why the navel is affecting the offset */
    this.position.set(this.offset.x - navel.x, this.offset.y - navel.y);
  }

  async updateFrameData(frameData: WzPngPieceInfo) {
    this.frameData = frameData;
    this.url = frameData._outlink || frameData.path;
    this.offset = {
      x: -frameData.origin.x,
      y: -frameData.origin.y,
    };
    await this.prepareResource();
    this.refreshView();
  }
}
