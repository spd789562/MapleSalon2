import type { WzPieceInfo } from '../character/const/wz';

export interface WzNickTagData {
  c: WzPieceInfo;
  e: WzPieceInfo;
  w: WzPieceInfo;
  clr?: number | string;
}
export type WzNickTag = WzNickTagData;
