import { Assets, Sprite } from 'pixi.js';
import { CharacterLoader } from './loader';

import type { Character } from './character';
import type {
  ItemInfo,
  RenderItemInfo,
  PieceName,
  RenderPieceInfo,
  PieceIslot,
  PieceVslot,
  WzItem,
  WzPieceFrame,
  AncherMap,
  AncherName,
  Vec2,
} from './models';
import { CharacterAction } from './models';

const defaultAncher: AncherMap = { navel: { x: 0, y: 0 } };

const handMoveDefaultAnchers = [
  { handMove: { x: -8, y: -2 } },
  { handMove: { x: -10, y: 0 } },
  { handMove: { x: -12, y: 3 } },
];

export class CharacterItem implements RenderItemInfo {
  info: ItemInfo;
  pieces: Map<PieceName, RenderPieceInfo[]>;
  islot: PieceIslot[];
  vslot: PieceVslot[];

  actionPieces: Map<CharacterAction, CharacterActionItem>;

  action: CharacterAction;

  wz: WzItem | null = null;

  constructor(info: ItemInfo, character: Character) {
    this.info = info;
    this.pieces = new Map();
    this.actionPieces = new Map();
    this.islot = [];
    this.vslot = [];

    this.action = character.action;
  }

  get isAllAncherBuilt() {
    return Array.from(this.actionPieces.values()).every(
      (actionItem) => actionItem.isAllAncherBuilt,
    );
  }

  async load() {
    if (this.wz) {
      return;
    }

    this.wz = await CharacterLoader.getPieceWz(this.info.id);

    if (this.wz === null) {
      return;
    }

    this.islot = (this.wz.info.islot.match(/.{1,2}/g) || []) as PieceIslot[];
    this.vslot = (this.wz.info.vslot.match(/.{1,2}/g) || []) as PieceIslot[];

    const actions = Object.keys(this.wz).filter((key) =>
      Object.values(CharacterAction).includes(key as CharacterAction),
    ) as CharacterAction[];

    for (const action of actions) {
      const actionWz = this.wz[action];

      if (!actionWz) {
        continue;
      }

      const actionItem = new CharacterActionItem(action, actionWz, this);

      this.actionPieces.set(action, actionItem);
    }

    for await (const actionItem of this.actionPieces.values()) {
      await actionItem.prepareResourece();
    }
  }
  tryBuildAncher(
    action: CharacterAction,
    currentAnchers: Map<AncherName, Vec2>[],
  ): Map<AncherName, Vec2>[] {
    return this.actionPieces.get(action)?.tryBuildAncher(currentAnchers) || [];
  }
}

export class CharacterActionItem {
  name: CharacterAction;

  framePieces: Map<PieceName, CharacterItemPiece>[];

  wz: Record<number, WzPieceFrame>;
  frameCount = 0;

  mainItem: CharacterItem;

  constructor(
    name: CharacterAction,
    wz: Record<number, WzPieceFrame>,
    mainItem: CharacterItem,
  ) {
    this.name = name;
    this.wz = wz;
    this.mainItem = mainItem;
    this.framePieces = [];
    const keys = Object.keys(wz).map((key) => Number.parseInt(key, 10));
    this.frameCount = keys.length;
    this.resolveFrames();
  }

  getPiecesByFrame(frame: number) {
    return this.framePieces[frame];
  }

  get isAllAncherBuilt() {
    return this.framePieces.every((pieces) =>
      Array.from(pieces.values()).every((piece) => piece.isAncherBuilt),
    );
  }

  tryBuildAncher(
    currentAnchers: Map<AncherName, Vec2>[],
  ): Map<AncherName, Vec2>[] {
    const ancherMap: Map<AncherName, Vec2>[] = [];
    for (let frame = 0; frame < this.frameCount; frame += 1) {
      const pieces = this.getPiecesByFrame(frame);
      if (!pieces) {
        continue;
      }
      const currentFrameAnchers = currentAnchers[frame];
      ancherMap[frame] = currentFrameAnchers
        ? currentFrameAnchers
        : new Map([['navel', defaultAncher.navel]]);

      if (
        (this.name === CharacterAction.Alert ||
          this.name === CharacterAction.Heal) &&
        !ancherMap[frame].has('handMove')
      ) {
        ancherMap[frame].set(
          'handMove',
          (handMoveDefaultAnchers[frame] || handMoveDefaultAnchers[0]).handMove,
        );
      }

      for (const piece of pieces.values()) {
        if (!piece.isAncherBuilt) {
          console.log('try build ancher', piece);
          const pieceAncher = piece.map;
          const pieceAncherKeys = Object.keys(pieceAncher);

          /** corresponding ancher in this piece */
          const baseAncherName = pieceAncherKeys.find((ancher) =>
            ancherMap[frame].get(ancher),
          );
          const baseAncher =
            baseAncherName && ancherMap[frame].get(baseAncherName);
          // if baseAncher doesn't contain any related ancher of this pieces, skip for now
          if (!(baseAncherName && baseAncher)) {
            continue;
          }
          piece.setAncher(baseAncherName as AncherName, baseAncher);

          for (const otherAncher of pieceAncherKeys.filter(
            (ancher) => ancher !== baseAncherName,
          )) {
            if (ancherMap[frame].has(otherAncher)) {
              continue;
            }
            const ancher = pieceAncher[otherAncher];
            ancherMap[frame].set(otherAncher, {
              x: piece.ancher.x + ancher.x,
              y: piece.ancher.y + ancher.y,
            });
          }
        }
      }
    }
    return ancherMap;
  }

  resolveFrames() {
    for (let frame = 0; frame < this.frameCount; frame += 1) {
      const wzData = this.wz[frame];
      if (!wzData) {
        continue;
      }
      const { delay = 0, ...restOfWzData } = wzData;
      const pieces = new Map<PieceName, CharacterItemPiece>();
      for (const pieceName in restOfWzData) {
        const piece = wzData[pieceName];
        const pieceUrl = piece._outlink || piece.url;
        if (!pieceUrl) {
          continue;
        }
        pieces.set(
          pieceName,
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
      }
      this.framePieces[frame] = pieces;
    }
  }

  async prepareResourece() {
    const pathes = new Set<string>();
    for (const framePieces of this.framePieces) {
      for (const piece of framePieces.values()) {
        if (piece.url) {
          pathes.add(piece.url);
        }
      }
    }

    const urls = Array.from(pathes).map((path) => ({
      alias: path,
      src: CharacterLoader.getPieceUrl(path),
      loadParser: 'loadTextures',
      format: '.webp',
    }));

    await Assets.load(urls);
  }
}

export class CharacterItemPiece implements RenderPieceInfo {
  info: ItemInfo;
  url?: string;
  group?: string;
  z: string;
  slot: string;
  origin: Vec2;
  map: AncherMap;
  delay: number;

  ancher: Vec2;

  isAncherBuilt = false;

  constructor(info: ItemInfo, piece: RenderPieceInfo) {
    this.info = info;
    this.url = piece.url;
    this.group = piece.group;
    this.z = piece.z;
    this.slot = piece.slot;
    this.origin = piece.origin;
    this.map = piece.map || defaultAncher;
    this.delay = piece.delay;
    this.ancher = defaultAncher.navel;
  }

  setAncher(ancherName: AncherName, baseAncher: Vec2) {
    this.ancher = {
      x: baseAncher.x - this.map[ancherName].x,
      y: baseAncher.y - this.map[ancherName].y,
    };

    this.isAncherBuilt = true;
  }

  get sprite() {
    return Sprite.from(this.url!);
  }

  get slotName() {
    return this.slot === 'default' ? this.z : this.z || this.slot;
  }
}
