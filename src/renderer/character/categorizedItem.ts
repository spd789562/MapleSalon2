import { Assets, type UnresolvedAsset } from 'pixi.js';

import type { CharacterItem } from './item';
import type { CharacterExpressions } from './const/emotions';
import type { AncherName, Vec2, PieceName, AncherMap } from './const/data';
import type { WzPieceFrame } from './const/wz';

import { CharacterItemPiece } from './itemPiece';
import { AnimatablePart } from '../AnimatablePart';
import { CharacterLoader } from './loader';

import { CharacterAction } from './const/actions';
import { defaultAncher, handMoveDefaultAnchers } from './const/ancher';

export abstract class CategorizedItem<Name extends string> {
  name: Name;

  unresolvedItems: Map<PieceName, CharacterItemPiece[]>;

  items: Map<PieceName, AnimatablePart>;

  wz: Record<number, WzPieceFrame>;
  frameCount = 0;

  mainItem: CharacterItem;

  constructor(
    name: Name,
    wz: Record<number, WzPieceFrame>,
    mainItem: CharacterItem,
  ) {
    this.name = name;
    this.wz = wz;
    this.mainItem = mainItem;
    this.items = new Map();
    this.unresolvedItems = new Map();
    const keys = Object.keys(wz).map((key) => Number.parseInt(key, 10));
    if (this.name === 'default' && keys.length === 0) {
      this.frameCount = 1;
    } else {
      this.frameCount = keys.length;
    }
    this.resolveFrames();
  }

  get isAllAncherBuilt() {
    return !Array.from(this.items.values()).some(
      (piece) => !piece.isAllAncherBuilt,
    );
  }

  /* do something before build ancher on each pieces */
  abstract ancherSetup(ancherMap: Map<AncherName, Vec2>, frame: number): void;

  tryBuildAncher(
    currentAnchers: Map<AncherName, Vec2>[],
  ): Map<AncherName, Vec2>[] {
    const ancherMapByFrame: Map<AncherName, Vec2>[] = [...currentAnchers];
    for (let frame = 0; frame < this.frameCount; frame += 1) {
      ancherMapByFrame[frame] =
        ancherMapByFrame[frame] || new Map([['navel', defaultAncher.navel]]);
      const currentFrameAnchers = ancherMapByFrame[frame];

      this.ancherSetup(currentFrameAnchers, frame);

      for (const item of this.items.values()) {
        const piece = item.frames[frame];
        if (piece && !piece.isAncherBuilt) {
          item.frames[frame].buildAncher(currentFrameAnchers);
        }
      }
    }
    return ancherMapByFrame;
  }

  resolveUseablePieceName(name: PieceName, z: string): PieceName {
    const zmap = CharacterLoader.zmap || [];
    if (zmap.includes(z as PieceName)) {
      return z as PieceName;
    }
    if (zmap.includes(name)) {
      return name;
    }
    return this.mainItem.islot[0];
  }

  /* resolve all frames and build AnimatablePart */
  resolveFrames() {
    const piecesByFrame = new Map<PieceName, CharacterItemPiece[]>();
    const isDefault = this.name === 'default' && this.frameCount === 1;
    for (let frame = 0; frame < this.frameCount; frame += 1) {
      /* the default frame might not contain frame */
      const wzData = isDefault
        ? (this.wz as unknown as WzPieceFrame)
        : this.wz[frame];
      if (!wzData) {
        /* it may unreachable, but if this.wz contains not number keys, it can prevent it */
        continue;
      }
      const { delay = 0, ...restOfWzData } = wzData;
      for (const pieceName in restOfWzData) {
        const piece = wzData[pieceName];
        const pieceUrl = piece._outlink || piece.url;
        if (!pieceUrl) {
          continue;
        }

        /* if pieces contains ear, only use character's */
        if (pieceName.match(/ear/i)) {
          if (this.mainItem.character.earType !== pieceName) {
            continue;
          }
        }

        const name = this.resolveUseablePieceName(
          pieceName,
          restOfWzData[pieceName].z,
        );

        if (!piecesByFrame.has(name)) {
          piecesByFrame.set(name, []);
        }
        const pieces = piecesByFrame.get(name) || [];
        pieces.push(
          new CharacterItemPiece(this.mainItem.info, {
            info: this.mainItem.info,
            url: pieceUrl,
            origin: piece.origin,
            z: piece.z,
            slot: pieceName,
            map: (piece.map as AncherMap) || defaultAncher,
            delay: delay || 60,
            group: piece.group,
          }),
        );
        piecesByFrame.set(name, pieces);
      }
    }

    this.unresolvedItems = piecesByFrame;
  }

  async prepareResourece() {
    const assets = new Set<UnresolvedAsset>();
    for (const items of this.unresolvedItems.values()) {
      for (const resources of items) {
        const res = resources.getResource();
        res && assets.add(res);
      }
    }

    await Assets.load(Array.from(assets));

    for (const [pieceName, pieces] of this.unresolvedItems) {
      this.items.set(pieceName as PieceName, new AnimatablePart(pieces));
    }

    this.unresolvedItems.clear();
  }
}

export class CharacterActionItem extends CategorizedItem<CharacterAction> {
  ancherSetup(ancherMap: Map<AncherName, Vec2>, frame: number) {
    if (
      (this.name === CharacterAction.Alert ||
        this.name === CharacterAction.Heal) &&
      !ancherMap.has('handMove')
    ) {
      ancherMap.set(
        'handMove',
        (handMoveDefaultAnchers[frame] || handMoveDefaultAnchers[0]).handMove,
      );
    }
  }
}

export class CharacterFaceItem extends CategorizedItem<CharacterExpressions> {
  ancherSetup(_: Map<AncherName, Vec2>, __: number) {
    // do nothing
  }
}
