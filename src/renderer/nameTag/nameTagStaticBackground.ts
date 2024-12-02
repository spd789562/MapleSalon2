import { Assets, Container, Sprite, Texture } from 'pixi.js';

import type { WzNameTagData } from './wz';

import { NameTagPiece } from './nameTagPiece';

export class NameTagStaticBackground extends Container {
  leftPiece?: NameTagPiece;
  centerPiece?: NameTagPiece;
  rightPiece?: NameTagPiece;
  left: Sprite;
  center: RepeatCenterPiece;
  right: Sprite;
  _nameWidth = 30;
  type = 'static';
  constructor() {
    super();
    this.left = new Sprite();
    this.center = new RepeatCenterPiece();
    this.right = new Sprite();
    this.addChild(this.left, this.center, this.right);
  }
  get topOffset() {
    return this.centerPiece?.origin.y || 0;
  }
  updatePiece(wz: WzNameTagData) {
    this.leftPiece = wz.w && new NameTagPiece(wz.w);
    this.centerPiece = wz.c && new NameTagPiece(wz.c);
    this.rightPiece = wz.e && new NameTagPiece(wz.e);
  }
  async prepareResource() {
    const resource = [
      this.leftPiece,
      this.centerPiece,
      this.rightPiece,
    ].flatMap((piece) => piece?.getResource() || []);

    for (const res of resource) {
      if (res) {
        await Assets.load(res);
      }
    }
  }
  renderBackground() {
    const left = this.leftPiece?.getTexture();
    const center = this.centerPiece?.getTexture();
    const right = this.rightPiece?.getTexture();

    const defaultOrigin = { x: 0, y: 0 };
    const leftAncher = this.leftPiece?.origin || defaultOrigin;
    const centerAncher = this.centerPiece?.origin || defaultOrigin;
    const rightAncher = this.rightPiece?.origin || defaultOrigin;

    this.left.texture = left || Texture.EMPTY;
    this.left.pivot.copyFrom(leftAncher);

    this.center.texture = center || Texture.EMPTY;
    this.center.renderByWidth();
    this.center.pivot.y = centerAncher.y;

    this.right.texture = right || Texture.EMPTY;
    this.right.position.x = this.center.width;
    this.right.pivot.copyFrom(rightAncher);

    this.pivot.x = this.center.width / 2;
    // this.pivot.y = -centerAncher.y;
  }
  set nameWidth(width: number) {
    this._nameWidth = width;
    this.center._nameWidth = width;
  }
}

class RepeatCenterPiece extends Container {
  _nameWidth = 30;
  texture = Texture.EMPTY;
  constructor() {
    super();
    this.texture = new Texture();
  }
  renderByWidth() {
    this.removeChildren();
    const centerCount = Math.ceil(this._nameWidth / this.texture.width);
    for (let i = 0; i < centerCount; i++) {
      const sprite = Sprite.from(this.texture);
      sprite.x = this.texture.width * i;
      this.addChild(sprite);
    }
  }
}
