import { Assets, type UnresolvedAsset } from 'pixi.js';

import type { CharacterItem } from './item';
import type { CharacterExpressions } from '@/const/emotions';
import type { AncherName, Vec2, PieceName, AncherMap } from './const/data';
import type { WzPieceFrame, WzEffectActionItem } from './const/wz';

import {
  CharacterItemPiece,
  DyeableCharacterItemPiece,
  EMPTY,
} from './itemPiece';
import { CharacterLoader } from './loader';
import { CharacterAnimatablePart } from './characterAnimatablePart';

import { CharacterEarType } from '@/const/ears';
import { CharacterAction } from '@/const/actions';
import { ExpressionsHasEye } from '@/const/emotions';
import { defaultAncher, handMoveDefaultAnchers } from './const/ancher';

export abstract class CategorizedItem<Name extends string> {
  name: Name;

  unresolvedItems: Map<PieceName, CharacterItemPiece[]>;

  items: Map<PieceName, CharacterAnimatablePart>;

  wz: Record<number, WzPieceFrame>;
  effectWz: WzEffectActionItem | undefined = undefined;
  frameCount = 0;

  mainItem: CharacterItem;

  constructor(
    name: Name,
    wz: Record<number, WzPieceFrame>,
    mainItem: CharacterItem,
    effectWz?: WzEffectActionItem,
  ) {
    this.name = name;
    this.wz = wz;
    this.effectWz = effectWz;
    this.mainItem = mainItem;
    this.items = new Map();
    this.unresolvedItems = new Map();
    const keys = Object.keys(wz).map((key) => Number.parseInt(key, 10) || 0);
    if (this.name === 'default' && keys.length === 0) {
      this.frameCount = 1;
    } else {
      /* some item only contain spcific frame, must calculate it */
      const maxFrame = keys.reduce((a, b) => Math.max(a, b + 1), keys.length);
      this.frameCount = maxFrame;
    }
    this.resolveFrames();
    this.resolveEffectFrames();
  }

  get isAllAncherBuilt() {
    return !Array.from(this.items.values()).some(
      (piece) => !piece.isAllAncherBuilt,
    );
  }

  /** do something before build ancher on each pieces */
  abstract ancherSetup(ancherMap: Map<AncherName, Vec2>, frame: number): void;

  abstract isDyeable(): boolean;

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
          item.frames[frame].buildAncher?.(currentFrameAnchers);
        }
      }
    }
    return ancherMapByFrame;
  }

  /** get piece name that validate in Zmap.img */
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

  resolveEffectFrames() {
    if (!this.effectWz) {
      return;
    }
    const hasFirstFrame = this.effectWz[0];
    if (!hasFirstFrame) {
      return;
    }
    const maxFrame = Object.keys(this.effectWz).reduce(
      (a, b) => (Number.isNaN(Number(b)) ? a : Math.max(a, Number(b))),
      0,
    );
    const pieces: CharacterItemPiece[] = [];

    const basePos = {
      x: 0,
      y: 0,
    };
    const effectPos = this.effectWz.pos ?? -1;

    /* pos logic is from MapleNecrocer */
    // if (effectPos === 0 || effectPos === 1) {
    //   basePos.x = -10;
    // }
    if (effectPos === 1) {
      basePos.y = -50;
    }

    for (let frame = 0; frame <= maxFrame; frame += 1) {
      const piece = this.effectWz[frame];

      if (!piece) {
        return;
      }
      const pieceUrl = piece._outlink || piece.path;

      if (!pieceUrl) {
        return;
      }

      const renderPiecesInfo = {
        info: this.mainItem.info,
        url: pieceUrl,
        origin: piece.origin,
        z: piece.z,
        slot: 'effect',
        map: (piece.map as AncherMap) || defaultAncher,
        delay: piece.delay || 120,
        group: piece.group,
      };
      const characterItemPiece = new CharacterItemPiece(
        renderPiecesInfo,
        this.mainItem,
        true,
      );
      characterItemPiece.position = {
        x: -piece.origin.x + basePos.x,
        y: -piece.origin.y + basePos.y,
      };

      pieces.push(characterItemPiece);
    }
    this.unresolvedItems.set('effect', pieces);
  }

  /** resolve all frames and build CharacterAnimatablePart Later */
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
        if (!piece) {
          continue;
        }
        const pieceUrl = piece._outlink || piece.path;
        if (!pieceUrl) {
          continue;
        }

        /* if pieces contains ear, only use character's */
        if (pieceName.match(/ear/i)) {
          const lowerCaseEarType = pieceName.toLowerCase();
          const lowerCaseCharacterEarType =
            this.mainItem.character.earType.toLowerCase();
          if (lowerCaseCharacterEarType !== lowerCaseEarType) {
            /* if character's ear is humanEar, but it not exist in wzData, then use ear instead */
            const isUseHumanEar =
              lowerCaseCharacterEarType ===
              CharacterEarType.HumanEar.toLowerCase();
            const hasHumanEar = !!restOfWzData[CharacterEarType.HumanEar];
            if (isUseHumanEar && hasHumanEar) {
              continue;
            }
            /* use ear if interate to it */
            if (lowerCaseEarType !== CharacterEarType.Ear.toLowerCase()) {
              continue;
            }
          }
        }

        const name = this.resolveUseablePieceName(
          pieceName,
          restOfWzData[pieceName].z,
        );

        if (!piecesByFrame.has(name)) {
          const initialPieces: CharacterItemPiece[] = new Array(
            this.frameCount,
          ).fill(EMPTY);
          piecesByFrame.set(name, initialPieces);
        }
        const pieces = piecesByFrame.get(name) || [];

        const renderPiecesInfo = {
          info: this.mainItem.info,
          url: pieceUrl,
          origin: piece.origin,
          z: piece.z,
          slot: pieceName,
          map: (piece.map as AncherMap) || defaultAncher,
          delay: delay,
          group: piece.group,
        };

        const characterItemPiece = this.isDyeable()
          ? new DyeableCharacterItemPiece(renderPiecesInfo, this.mainItem)
          : new CharacterItemPiece(renderPiecesInfo, this.mainItem);
        pieces[frame] = characterItemPiece;
      }
    }

    this.unresolvedItems = piecesByFrame;
  }

  async prepareResoureceByFrame(index: number) {
    if (this.unresolvedItems.size === 0) {
      return;
    }
    const assets = new Set<UnresolvedAsset>();
    for (const items of this.unresolvedItems.values()) {
      const res = items[index]?.getResource() || [];
      if (res?.length) {
        for (const asset of res) {
          assets.add(asset);
        }
      }
    }
    await Assets.load(Array.from(assets));

    for (const [pieceName, pieces] of this.unresolvedItems) {
      const existItem = this.items.get(pieceName as PieceName);
      if (existItem) {
        /* update certain frame */
        existItem.frames = existItem.frames.map((frame, i) => {
          if (i === index) {
            return pieces[index];
          }
          return frame;
        });
      } else {
        const isEffect = pieceName === 'effect' && this.effectWz !== undefined;
        const frames = pieces.map((frame, i) => {
          if (i === index) {
            return frame;
          }
          return EMPTY;
        }) as CharacterItemPiece[];
        this.items.set(
          pieceName as PieceName,
          new CharacterAnimatablePart(
            this.mainItem,
            frames,
            isEffect ? this.effectWz?.z : undefined,
          ),
        );
      }
    }
  }

  async prepareResourece() {
    // if unresolvedItems is empty, it means the item is already loaded
    if (this.unresolvedItems.size === 0) {
      return;
    }

    const assets = new Set<UnresolvedAsset>();
    for (const items of this.unresolvedItems.values()) {
      for (const resources of items) {
        const res = resources.getResource();
        if (res) {
          for (const asset of res) {
            assets.add(asset);
          }
        }
      }
    }

    await Assets.load(Array.from(assets));

    for (const [pieceName, pieces] of this.unresolvedItems) {
      const isEffect = pieceName === 'effect' && this.effectWz !== undefined;
      this.items.set(
        pieceName as PieceName,
        new CharacterAnimatablePart(
          this.mainItem,
          pieces,
          isEffect ? this.effectWz?.z : undefined,
        ),
      );
    }

    this.unresolvedItems.clear();
  }

  destroy() {
    for (const item of this.items.values()) {
      item.removeFromParent();
      item.destroy();
    }
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
  isDyeable() {
    return this.mainItem.info.dye !== undefined;
  }
}

export class CharacterFaceItem extends CategorizedItem<CharacterExpressions> {
  ancherSetup(_: Map<AncherName, Vec2>, __: number) {
    // do nothing
  }
  isDyeable() {
    const hasDye = this.mainItem.info.dye !== undefined;
    return hasDye && ExpressionsHasEye.includes(this.name);
  }
}
