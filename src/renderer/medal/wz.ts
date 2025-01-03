import type { WzPieceInfo } from '../character/const/wz';

export interface WzMedalData {
  c: WzPieceInfo;
  e: WzPieceInfo;
  w: WzPieceInfo;
  clr?: number | string;
}

export type WzAnimatedMedalData = WzMedalData & {
  ani: Record<number, WzPieceInfo>;
};

export type WzMedal = WzMedalData | WzAnimatedMedalData;
