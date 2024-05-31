import type { PieceName, PieceZ, PieceGroup, AncherMap, Vec2 } from './data';

export type WzItem = Record<string, Record<number, WzPieceFrame>> & {
  info: WzItemInfo;
};
export interface WzItemInfo {
  cash?: boolean;
  islot: string;
  vslot: string;
  colorvar: boolean;
  royalSpecial: boolean;
}

export type WzPieceFrame = Record<PieceName, WzPieceInfo> & {
  delay: number;
};

/** PieceInfo structure in wz */
export interface WzPieceInfo {
  origin: Vec2;
  z: PieceZ;
  _outlink?: string;
  _inlink?: string;
  group?: PieceGroup;
  map?: AncherMap;
  path?: string;
}
