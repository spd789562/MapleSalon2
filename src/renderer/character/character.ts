import { Container } from 'pixi.js';
import type { ItemInfo, AncherName, Vec2, CharacterExpression } from './models';
import { CharacterAction, AncherMap } from './models';

import { CharacterLoader } from './loader';
import {
  CharacterItem,
  type CharacterActionItem,
  type CharacterItemPiece,
} from './item';

export class Character extends Container {
  idItems = new Map<number, CharacterItem>();
  actionAnchers = new Map<CharacterAction, Map<AncherName, Vec2>[]>();
  action = CharacterAction.Stand1;
  expression: CharacterExpression = 'default';
  frame = 0;

  constructor() {
    super();
    this.sortableChildren = true;
  }

  updateItems(items: ItemInfo[]) {
    for (const item of items) {
      const chItem = new CharacterItem(item, this);
      // chItem.load();
      this.idItems.set(item.id, chItem);
    }
  }

  get currentAllItem() {
    return Array.from(this.idItems.values())
      .map((item) => item.actionPieces.get(this.action))
      .filter((item) => item) as CharacterActionItem[];
  }

  get currentAllPieces() {
    return this.currentAllItem.flatMap((item) => item.framePieces[this.frame]);
  }

  render() {
    const zmap = CharacterLoader?.zmap;
    if (!zmap) {
      return;
    }
    const allPieces = this.currentAllPieces;
    for (const layer of zmap) {
      let piece: CharacterItemPiece;
      for (const item of allPieces) {
        if (item.has(layer)) {
          piece = item.get(layer) as CharacterItemPiece;
          const sprite = piece.sprite;
          sprite.position.set(
            piece.ancher.x - (piece.origin?.x || 0),
            piece.ancher.y - (piece.origin?.y || 0),
          );
          this.addChild(sprite);
          break;
        }
      }
    }
  }

  get isAllAncherBuilt() {
    return Array.from(this.idItems.values()).every(
      (item) => item.isAllAncherBuilt,
    );
  }

  async loadItems() {
    for (const item of this.idItems.values()) {
      await item.load();
    }
    const itemCount = this.idItems.size;
    // try to build ancher but up to 2 times of item count
    for (let i = 0; i < itemCount * 4; i++) {
      if (this.isAllAncherBuilt) {
        break;
      }
      this.buildAncher();
    }
  }
  buildAncher() {
    for (const action of Object.values(CharacterAction)) {
      for (const item of this.idItems.values()) {
        const ancher = this.actionAnchers.get(action);
        this.actionAnchers.set(
          action,
          item.tryBuildAncher(action, ancher || []),
        );
      }
    }
  }
}
