import { Texture, Assets, type PointData, type UnresolvedAsset } from 'pixi.js';

import type { WzPieceInfo } from '../character/const/wz';
import { CharacterLoader } from '../character/loader';

export class NameTagPiece {
  origin: PointData;
  url: string;
  delay?: number;
  constructor(info: WzPieceInfo) {
    this.origin = info.origin;
    this.url = info._outlink || info.path || '';
    /* @ts-ignore */
    this.delay = info.delay;
  }
  getTexture() {
    if (!this.url) {
      return Texture.EMPTY;
    }
    return Assets.get<Texture>(this.url);
  }
  getResource() {
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
}
