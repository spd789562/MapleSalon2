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
import { CharacterStaticPart } from './characterStaticPart';

import type { CharacterEarType } from '@/const/ears';
import { CharacterAction } from '@/const/actions';
import { ExpressionsHasEye } from '@/const/emotions';
import { defaultAncher, handMoveDefaultAnchers } from './const/ancher';
import { isMixDyeableId } from '@/utils/itemId';

const EarReg = /ear$/i;

export abstract class CategorizedItem<Name extends string> {
  name: Name;

  unresolvedItems: Map<PieceName, CharacterItemPiece[][]>;

  /* usually only effect will be here */
  animatableItems: Map<PieceName, CharacterAnimatablePart[]>;
  items: Map<PieceName, CharacterStaticPart[][]>;

  wz: Record<number, WzPieceFrame>;
  effectWz: WzEffectActionItem | undefined = undefined;
  frameCount = 0;

  mainItem: CharacterItem;

  constructor(
    name: Name,
    wz: Record<number, WzPieceFrame>,
    mainItem: CharacterItem,
    effectWz?: WzEffectActionItem,
    defaultEffectZ?: number,
  ) {
    this.name = name;
    this.wz = wz;
    this.effectWz = effectWz;
    this.mainItem = mainItem;
    this.items = new Map();
    this.animatableItems = new Map();
    this.unresolvedItems = new Map();
    if (effectWz && effectWz.z === undefined) {
      effectWz.z = defaultEffectZ ?? -1;
    }
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

  getPiecesByFrame(frame: number) {
    return (
      Array.from(this.items.values())
        .flatMap((item) => item.map((i) => i[frame]))
        ?.filter((i) => i) || []
    );
  }

  isAllAncherBuiltByFrame(frame: number) {
    return this.getPiecesByFrame(frame).every((piece) => piece.isAncherBuilt);
  }

  get allPieces() {
    return Array.from(this.items.values()).flat().flat();
  }
  get allAnimatablePieces() {
    return Array.from(this.animatableItems.values()).flat();
  }

  get effectBasePos() {
    const basePos = {
      x: 10,
      y: 50,
    };
    const effectPos = this.effectWz?.pos ?? -1;

    /* pos logic is from MapleNecrocer */
    if (effectPos === 0 || effectPos === 1) {
      basePos.x = 0;
    }
    if (effectPos === 1) {
      basePos.y = 0;
    }
    // for job tails like kaiser and hoyoung
    if (effectPos === 4) {
      basePos.y = 25;
      basePos.x = 0;
    }

    return basePos;
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

      this.tryBuildAncherByFrame(currentFrameAnchers, frame);
    }
    return ancherMapByFrame;
  }

  tryBuildAncherByFrame(currentAncher: Map<AncherName, Vec2>, frame: number) {
    this.ancherSetup(currentAncher, frame);
    for (const item of this.getPiecesByFrame(frame)) {
      const piece = item.frameData;
      /* seems if filter piece.isAncherBuilt will causing */
      if (piece && !piece.isAncherBuilt) {
        piece.buildAncher?.(currentAncher);
      }
    }
    return currentAncher;
  }

  resetAncherByFrame(frame: number) {
    for (const item of this.getPiecesByFrame(frame)) {
      const piece = item.frameData;
      /* seems if filter piece.isAncherBuilt will causing */
      if (piece && !piece.noAncher) {
        piece.isAncherBuilt = false;
      }
    }
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
    // try to resolve number z
    if (!Number.isNaN(Number(z))) {
      return zmap[zmap.length - 10 - Number(z)];
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

    const basePos = this.effectBasePos;

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
      characterItemPiece.baseAncherName = 'brow';
      characterItemPiece.position = {
        x: -piece.origin.x + basePos.x,
        y: -piece.origin.y + basePos.y,
      };

      pieces.push(characterItemPiece);
    }
    appendUnresolvedItems(this, 'effect', [pieces]);
  }

  /** resolve all frames and build CharacterAnimatablePart Later */
  resolveFrames() {
    /* key by `${PieceName}-${z}` */
    const piecesByFrame = new Map<string, [string, CharacterItemPiece[]]>();
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

        /* some thing like capeArm also has ear... so only do end with here */
        const isEar = pieceName.match(EarReg);

        const name = isEar
          ? pieceName
          : this.resolveUseablePieceName(pieceName, restOfWzData[pieceName].z);

        const pieceNameHash = `${pieceName}-${name}`;
        let pieces = piecesByFrame.get(pieceNameHash);

        /* use pieceName prevent conflict before got resolved */
        if (!pieces) {
          const initialPieces: CharacterItemPiece[] = new Array(
            this.frameCount,
          ).fill(EMPTY);
          pieces = [name, initialPieces];
          piecesByFrame.set(pieceNameHash, pieces);
        }

        let ancherMap = piece.map as AncherMap;

        if (!ancherMap) {
          /* some item has effect and it doesn't have ancher it self, try to use effect's ancher */
          if (this.effectWz && !this.effectWz.pos) {
            const effectPost = this.effectBasePos;
            ancherMap = {
              brow: {
                x: -effectPost.x,
                y: -effectPost.y,
              },
            };
          } else {
            ancherMap = defaultAncher;
          }
        }

        const renderPiecesInfo = {
          info: this.mainItem.info,
          url: pieceUrl,
          origin: piece.origin,
          z: piece.z,
          slot: pieceName,
          map: ancherMap,
          delay: delay,
          group: piece.group,
        };

        const characterItemPiece = this.isDyeable()
          ? new DyeableCharacterItemPiece(renderPiecesInfo, this.mainItem)
          : new CharacterItemPiece(renderPiecesInfo, this.mainItem);
        pieces[1][frame] = characterItemPiece;
      }
    }

    for (const [name, pieces] of piecesByFrame.values()) {
      appendUnresolvedItems(this, name, [pieces]);
    }
  }

  async loadResourceByFrame(index: number) {
    if (this.unresolvedItems.size === 0) {
      return;
    }
    const assets = new Set<UnresolvedAsset>();
    for (const items of this.unresolvedItems.values()) {
      const itemResources = items.flatMap(
        (item) => item[index % item.length]?.getResource?.() || [],
      );
      for (const asset of itemResources) {
        assets.add(asset);
      }
    }
    await Assets.load(Array.from(assets));
  }
  prepareAnimatableResoureceByFrame(index: number) {
    for (const [pieceName, pieces] of this.unresolvedItems) {
      if (!(pieceName === 'effect' && this.effectWz !== undefined)) {
        continue;
      }
      let existItems = this.animatableItems.get(pieceName as PieceName);
      if (!existItems) {
        const item = [] as CharacterAnimatablePart[];
        this.animatableItems.set(pieceName as PieceName, item);
        existItems = item;
      }
      for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex += 1) {
        const itemPieces = pieces[pieceIndex];
        const existItem = existItems[pieceIndex];
        if (existItem) {
          /* update certain frame of CharacterAnimatablePart */
          existItem.frames = existItem.frames.map((frame, i) => {
            if (i === index) {
              return itemPieces[index];
            }
            return frame;
          });
        } else {
          const frames = itemPieces.map((frame, i) => {
            if (i === index) {
              return frame;
            }
            return EMPTY;
          }) as CharacterItemPiece[];
          existItems[pieceIndex] = new CharacterAnimatablePart(
            this.mainItem,
            frames,
            this.effectWz?.z ?? -1,
          );
        }
      }
      // this.animatableItems.set(pieceName as PieceName, existItems);
    }
  }
  prepareResoureceByFrame(index: number) {
    for (const [pieceName, pieces] of this.unresolvedItems) {
      if (pieceName === 'effect' && this.effectWz !== undefined) {
        continue;
      }

      let existItems = this.items.get(pieceName as PieceName);

      if (!existItems) {
        const item = [] as CharacterStaticPart[][];
        this.items.set(pieceName as PieceName, item);
        existItems = item;
      }
      for (let pieceIndex = 0; pieceIndex < pieces.length; pieceIndex += 1) {
        const itemPieces = pieces[pieceIndex];
        const existItem = existItems[pieceIndex];
        const modIndex = index % itemPieces.length;
        if (existItem) {
          /* update certain frame */
          existItem[modIndex]?.updateFrameData(itemPieces[modIndex]);
        } else {
          const frames = itemPieces.map((frame, i) => {
            if (i === modIndex) {
              return new CharacterStaticPart(this.mainItem, frame, modIndex);
            }
            return new CharacterStaticPart(
              this.mainItem,
              EMPTY as unknown as CharacterItemPiece,
              i,
            );
          }) as CharacterStaticPart[];
          existItems[pieceIndex] = frames;
        }
      }
    }
  }

  async loadAnimatableResource() {
    // if unresolvedItems is empty, it means the item is already loaded
    if (this.unresolvedItems.size === 0) {
      return;
    }
    const assets = new Set<UnresolvedAsset>();
    for (const [pieceName, items] of this.unresolvedItems) {
      const isEffect = pieceName === 'effect' && this.effectWz !== undefined;
      if (!isEffect) {
        continue;
      }
      for (const itemPieces of items) {
        const itemResources = itemPieces.flatMap(
          (item) => item.getResource?.() || [],
        );
        for (const asset of itemResources) {
          assets.add(asset);
        }
      }
    }

    await Assets.load(Array.from(assets));
  }
  async loadResource() {
    // if unresolvedItems is empty, it means the item is already loaded
    if (this.unresolvedItems.size === 0) {
      return;
    }

    const assets = new Set<UnresolvedAsset>();
    for (const items of this.unresolvedItems.values()) {
      for (const itemPieces of items) {
        const itemResources = itemPieces.flatMap(
          (item) => item.getResource?.() || [],
        );
        for (const asset of itemResources) {
          assets.add(asset);
        }
      }
    }

    await Assets.load(Array.from(assets));
  }
  prepareResourece() {
    this.items.clear();
    for (const [pieceName, pieces] of this.unresolvedItems) {
      const isEffect = pieceName === 'effect' && this.effectWz !== undefined;
      if (isEffect) {
        continue;
      }
      const staticParts = pieces.map((itemPieces) =>
        itemPieces.map(
          (pieceData, index) =>
            new CharacterStaticPart(this.mainItem, pieceData, index),
        ),
      );
      appendItems(this, pieceName, staticParts);
    }

    this.unresolvedItems.clear();
  }
  prepareAnimatableResourece() {
    if (this.animatableItems.size > 0) {
      return;
    }
    for (const [pieceName, pieces] of this.unresolvedItems) {
      const isEffect = pieceName === 'effect' && this.effectWz !== undefined;
      if (!isEffect) {
        continue;
      }
      for (const itemPieces of pieces) {
        appendItems(
          this,
          pieceName,
          [
            new CharacterAnimatablePart(
              this.mainItem,
              itemPieces,
              this.effectWz?.z ?? -1,
            ),
          ],
          'animatableItems',
        );
      }
    }
  }

  destroy() {
    for (const item of this.allPieces) {
      item.removeFromParent();
      item.destroy();
    }
    for (const item of this.allAnimatablePieces) {
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
    return isMixDyeableId(this.mainItem.info.id);
  }
  getAvailableEar(earType: CharacterEarType) {
    /* this logic seems not right */
    /* if character's ear is humanEar, but it not exist in wzData, then use ear instead */
    // if (
    //   earType === CharacterEarType.HumanEar &&
    //   !this.items.has(CharacterEarType.HumanEar)
    // ) {
    //   return this.items.get(CharacterEarType.Ear);
    // }
    return this.items.get(earType);
  }
}

export class CharacterFaceItem extends CategorizedItem<CharacterExpressions> {
  ancherSetup(_: Map<AncherName, Vec2>, __: number) {
    // do nothing
  }
  isDyeable() {
    const hasDye = isMixDyeableId(this.mainItem.info.id);
    return hasDye && ExpressionsHasEye.includes(this.name);
  }
}

function appendUnresolvedItems<T extends string>(
  item: CategorizedItem<T>,
  name: string,
  items: CharacterItemPiece[][],
) {
  const existItem = item.unresolvedItems.get(name);
  if (existItem) {
    existItem.push(...items);
  } else {
    item.unresolvedItems.set(name, items);
  }
}

function appendItems<T extends string>(
  item: CategorizedItem<T>,
  name: string,
  items: CharacterAnimatablePart[] | CharacterStaticPart[][],
  fields: 'items' | 'animatableItems' = 'items',
) {
  const existItem = item[fields].get(name as PieceName);
  if (existItem) {
    /* @ts-ignore */
    existItem.push(...items);
  } else {
    /* @ts-ignore */
    item[fields].set(name as PieceName, items);
  }
}
