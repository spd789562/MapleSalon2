import {
  Assets,
  Sprite,
  Texture,
  Container,
  type UnresolvedAsset,
} from 'pixi.js';
import type { WzPngPieceInfo } from './const/wz';
import type { TamingMobItem } from './tamingMobItem';

import { CharacterLoader } from '../character/loader';

export class TamingMobPart extends Container {
  item: TamingMobItem;
  frameData: WzPngPieceInfo;
  frame: number;
  url?: string;

  _srpite: Container | null = null;

  constructor(item: TamingMobItem, frameData: WzPngPieceInfo, frame: number) {
    super();
    this.frame = frame;
    this.frameData = frameData;
    this.item = item;
    this.filters = item.filters;
    this.url = frameData._outlink || frameData.path;
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
    this._srpite = new Sprite(this.getTexture());
    return this._srpite;
  }
  refreshView() {
    this.removeChildren();
    this.addChild(this.getRenderAble());
  }

  async updateFrameData(frameData: WzPngPieceInfo) {
    this.frameData = frameData;
    this.url = frameData._outlink || frameData.path;
    await this.prepareResource();
    this.refreshView();
  }
}
