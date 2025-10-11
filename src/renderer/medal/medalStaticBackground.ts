import { Assets, Container, Sprite, Texture, TilingSprite } from 'pixi.js';

import type { WzMedalData } from './wz';

import { MedalPiece } from './medalPiece';

export class MedalStaticBackground extends Container {
  leftPiece?: MedalPiece;
  centerPiece?: MedalPiece;
  rightPiece?: MedalPiece;
  left: Sprite;
  center: TilingSprite;
  right: Sprite;
  nameWidth;
  type = 'static';

  isEmptyCenter = false;

  constructor(wz: WzMedalData, nameWidth: number) {
    super();
    this.left = new Sprite();
    this.center = new TilingSprite();
    this.center.width = nameWidth;
    this.right = new Sprite();
    this.nameWidth = nameWidth;
    this.addChild(this.left, this.center, this.right);
    this.leftPiece = wz.w && new MedalPiece(wz.w);
    this.centerPiece = wz.c && new MedalPiece(wz.c);
    this.rightPiece = wz.e && new MedalPiece(wz.e);
  }
  get topOffset() {
    return this.centerPiece?.origin.y || 0;
  }
  async prepareResource() {
    const resource = [
      this.leftPiece,
      this.centerPiece,
      this.rightPiece,
    ].flatMap((piece) => piece?.getResource() || []);

    await Assets.load(resource);

    const centerTexture = this.centerPiece?.getTexture();
    if (centerTexture) {
      this.isEmptyCenter =
        centerTexture.width === 1 && centerTexture.height === 1;
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

    const centerTexture = center || Texture.EMPTY;
    this.center.texture = centerTexture;
    this.center.height = centerTexture.height;
    this.center.width = Math.max(this.nameWidth, centerTexture.width);
    this.center.pivot.y = centerAncher.y;

    this.right.texture = right || Texture.EMPTY;
    this.right.position.x = this.center.width;
    this.right.pivot.copyFrom(rightAncher);

    this.pivot.x = this.center.width / 2;
  }
}
