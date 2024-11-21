import { Assets, Container, Sprite, Texture } from 'pixi.js';

import type {
  WzChatBalloon,
  WzChatBalloonData,
  WzAnimatedChatBalloon,
} from './wz';

import { ChatBalloonPiece } from './chatBalloonPiece';

const PieceFields = [
  'nw',
  'n',
  'ne',
  'w',
  'c',
  'e',
  'sw',
  's',
  'se',
  'arrow',
  'head',
] as const;

export class ChatBalloonBackground extends Container {
  type = 'static';
  minWidth = 80;
  minHeight = 40;
  // [tl, t, tr, l, c, r, bl, b, br, arrow?, head?]
  assets: Texture[] = [];
  pieces: (ChatBalloonPiece | undefined)[] = [];
  id = 0;

  get colWidth() {
    return this.assets[4].width;
  }
  get colHeight() {
    return this.assets[4].height;
  }
  get topOffset() {
    return Math.max(
      this.pieces[0]?.origin.y || 0,
      this.pieces[1]?.origin.y || 0,
      // this.pieces[2]?.origin.y || 0,
      // this.pieces[10]?.origin.y || 0,
    );
  }
  get leftOffset() {
    return Math.min(this.pieces[0]?.origin.x || 0);
  }
  get topLeftPadding() {
    return {
      x: (this.assets[0]?.width || 5) - this.leftOffset,
      y: (this.assets[0]?.height || 5) - this.topOffset,
    };
  }
  updatePiece(wz: WzChatBalloon) {
    let data: WzChatBalloonData;
    if ((wz as WzAnimatedChatBalloon)[0]) {
      data = (wz as WzAnimatedChatBalloon)[0];
    } else {
      data = wz as WzChatBalloonData;
    }
    this.pieces = PieceFields.map(
      (field) => data[field] && new ChatBalloonPiece(data[field]),
    );
    this.assets = [];
  }
  async prepareResource() {
    const resource = this.pieces
      .flatMap((piece) => piece?.getResource() || [])
      .filter((res) => res)
      .map((res) => Assets.load(res));

    await Promise.all(resource);

    this.assets = this.pieces.map(
      (piece) => piece?.getTexture() || Texture.EMPTY,
    );
  }
  renderBackground() {
    for (const sprite of this.children) {
      sprite.destroy();
    }
    this.removeChildren();
    const colCount = Math.ceil(this.minWidth / this.colWidth);
    const rowCount = Math.ceil(this.minHeight / this.colHeight);
    let x = 0;
    let y = 0;
    const xOffsetByArrow =
      this.pieces[9] && this.assets[7].width > this.assets[9].width
        ? this.assets[7].width - this.assets[9].width
        : 0;
    // top
    this.addSpriteWithPos(0, x, y);
    x += this.assets[0].width - (this.pieces[0]?.origin.x || 0);
    const half = Math.floor(colCount / 2);
    for (let i = 0; i < colCount; i++) {
      if (i === half && this.pieces[10]) {
        this.addSpriteWithPos(10, x, y);
        // x += this.assets[10].width;
      } else {
        this.addSpriteWithPos(1, x, y);
      }
      x += this.assets[1].width;
    }
    x -= xOffsetByArrow;
    this.addSpriteWithPos(2, x, y);
    x = 0;
    y += this.assets[0].height - this.topOffset;
    // middle
    for (let i = 0; i < rowCount; i++) {
      this.addSpriteWithPos(3, x, y);
      x = this.assets[3].width - (this.pieces[3]?.origin.x || 0);
      for (let j = 0; j < colCount; j++) {
        this.addSpriteWithPos(4, x, y);
        x += this.colWidth;
      }
      x -= xOffsetByArrow;
      this.addSpriteWithPos(5, x, y);
      y += this.colHeight;
      x = 0;
    }
    // bottom
    this.addSpriteWithPos(6, x, y);
    x += this.assets[6].width - (this.pieces[6]?.origin.x || 0);
    for (let i = 0; i < colCount; i++) {
      if (i === 0 && this.pieces[9]) {
        this.addSpriteWithPos(9, x, y);
        if (this.assets[7].width > this.assets[9].width) {
          x -= this.assets[7].width - this.assets[9].width;
        }
      } else {
        this.addSpriteWithPos(7, x, y);
      }
      x += this.colWidth;
    }
    this.addSpriteWithPos(8, x, y);
  }
  addSpriteWithPos(textureIndex: number, x: number, y: number) {
    const sprite = new Sprite(this.assets[textureIndex]);
    const offset = this.pieces[textureIndex]?.origin || { x: 0, y: 0 };
    const xOffsetByArrow =
      this.pieces[9] && this.assets[7].width > this.assets[9].width
        ? this.assets[7].width - this.assets[9].width
        : 0;
    sprite.position.set(x, y);
    sprite.pivot.set(
      offset.x === -1 && xOffsetByArrow === 0 ? 0 : offset.x,
      offset.y,
    );
    this.addChild(sprite);
  }
}
