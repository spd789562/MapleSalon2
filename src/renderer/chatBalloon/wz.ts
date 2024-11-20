import type { WzPieceInfo } from '../character/const/wz';

export interface WzChatBalloonData {
  arrow?: WzPieceInfo;
  head?: WzPieceInfo;
  nw: WzPieceInfo;
  n: WzPieceInfo;
  ne: WzPieceInfo;
  w: WzPieceInfo;
  c: WzPieceInfo;
  e: WzPieceInfo;
  sw: WzPieceInfo;
  s: WzPieceInfo;
  se: WzPieceInfo;
  clr?: number | string;
}

export type WzAnimatedChatBalloon = Record<number, WzChatBalloonData> & {
  clr?: number | string;
};

export type WzChatBalloon = WzChatBalloonData | WzAnimatedChatBalloon;
