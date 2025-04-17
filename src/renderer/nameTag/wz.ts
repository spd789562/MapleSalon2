import type { WzPieceInfo } from '../character/const/wz';

export interface WzNameTagData {
  c: WzPieceInfo;
  e: WzPieceInfo;
  w: WzPieceInfo;
  clr?: number | string;
}

export type WzAnimtedNameTag = WzNameTagData & Partial<WzAnimatedNameTagData>;

export type WzAnimatedNameTagData = Record<number, WzAnimatedNameTagLayer> & {
  bottomoffset: number;
  heightoffset: number;
  wz2_aniNameTag: string;
  aniNameTag: string; // newer animated name tag
};
export type WzAnimatedNameTagLayer = WzPieceInfo[];

export type WzNameTag = WzNameTagData | WzAnimtedNameTag;
