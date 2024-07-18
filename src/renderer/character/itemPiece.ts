import {
  Assets,
  type Container,
  Sprite,
  Texture,
  type UnresolvedAsset,
} from 'pixi.js';

import type { AnimatableFrame } from '../AnimatablePart';
import type { CharacterItem } from './item';
import type {
  AncherMap,
  AncherName,
  ItemInfo,
  RenderPieceInfo,
  Vec2,
} from './const/data';

import { CharacterLoader } from './loader';
import { DyeableSprite } from './dyeableSprite';

import { defaultAncher } from './const/ancher';

export class CharacterItemPiece implements AnimatableFrame {
  info: ItemInfo;
  url: string;
  group?: string;
  z: string;
  slot: string;
  origin: Vec2;
  map: AncherMap;
  delay: number;

  zIndex: number;

  item: CharacterItem;

  /** calcualted ancher use to calculate for new joint */
  ancher: Vec2;
  baseAncherName: AncherName = 'navel';
  noAncher: boolean;

  isAncherBuilt = false;

  /* pieces not create new joint, means there is no other one can rely on this piece's ancher */
  isIndepened = false;

  /** offset of piece */
  position = { x: 0, y: 0 };

  _srpite: Container | null = null;

  constructor(piece: RenderPieceInfo, item: CharacterItem, noAncher = false) {
    this.info = piece.info;
    this.url = piece.url || '';
    this.group = piece.group;
    this.z = piece.z;
    this.slot = piece.slot;
    this.origin = piece.origin;
    this.map = piece.map || defaultAncher;
    this.delay = piece.delay;
    this.ancher = defaultAncher.navel;
    this.noAncher = noAncher;
    this.item = item;
    this.zIndex =
      CharacterLoader.zmap?.findIndex((z) => z === this.z) ||
      CharacterLoader.zmap?.findIndex((z) => z === this.slotName) ||
      0;
    this.isIndepened = Object.keys(this.map).length === 1 || noAncher;
  }

  get slotName() {
    return this.slot === 'default' ? this.z : this.z || this.slot;
  }

  isDyeable(): this is DyeableCharacterItemPiece {
    return this instanceof DyeableCharacterItemPiece;
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

  setAncher(ancherName: AncherName, baseAncher: Vec2) {
    this.ancher = {
      x: baseAncher.x - this.map[ancherName].x,
      y: baseAncher.y - this.map[ancherName].y,
    };
    this.position = {
      x: -this.map[ancherName].x - (this.origin?.x || 0),
      y: -this.map[ancherName].y - (this.origin?.y || 0),
    };

    this.isAncherBuilt = true;
  }

  /** build ancher and `update` frameAncherMap if any new ancher */
  buildAncher(frameAncherMap: Map<AncherName, Vec2>) {
    const pieceAncherKeys = Object.keys(this.map) as AncherName[];

    /** corresponding ancher in this piece */
    const baseAncherName = pieceAncherKeys.find((ancher) =>
      frameAncherMap.get(ancher),
    );
    const baseAncher = baseAncherName && frameAncherMap.get(baseAncherName);
    // if baseAncher doesn't contain any related ancher of this pieces, skip for now
    if (!(baseAncherName && baseAncher) || this.noAncher) {
      return;
    }

    this.baseAncherName = baseAncherName;

    this.setAncher(baseAncherName as AncherName, baseAncher);

    const notBuiltedAnchers = pieceAncherKeys.filter(
      (ancher) => ancher !== baseAncherName && !frameAncherMap.has(ancher),
    );
    // is this piece contains other ancher and not in the frameAncherMap, add them to map
    for (const otherAncher of notBuiltedAnchers) {
      const ancher = this.map[otherAncher];
      // the new ancher is base on current piece's ancher
      frameAncherMap.set(otherAncher, {
        x: this.ancher.x + ancher.x,
        y: this.ancher.y + ancher.y,
      });
    }
  }
}

export class DyeableCharacterItemPiece extends CharacterItemPiece {
  getRenderAble() {
    if (this._srpite) {
      return this._srpite;
    }
    this._srpite = new DyeableSprite(this.item, this.url);
    return this._srpite;
  }
  async updateDye() {
    return (this._srpite as DyeableSprite)?.updateDye?.();
  }
}

class CharacterEmptyPiece implements AnimatableFrame {
  position = { x: 0, y: 0 };
  delay = 100;
  baseAncherName: AncherName = 'navel';
  isAncherBuilt = true;
  zIndex = -1;
  group = 'empty';

  getTexture() {
    return Texture.EMPTY;
  }

  getRenderAble() {
    return Sprite.from(Texture.EMPTY);
  }

  getResource() {
    return [];
  }
}

export const EMPTY = new CharacterEmptyPiece();
