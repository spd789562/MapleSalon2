import type { Vec2 } from './data';
import type { CharacterAction } from '@/const/actions';
import type { CharacterExpressions } from '@/const/emotions';

export type WzTamingMobData = { info: WzTamingMobInfo } & Record<
  CharacterAction,
  Record<number, WzTamingMobFrameItem>
>;

export interface WzTamingMobInfo {
  tamingMob: number;
}

export type WzTamingMobFrameItem = {
  delay: number;
} & Record<number, WzPngPieceInfo> &
  Partial<WzTamingMobFrameItemExt>;

export interface WzTamingMobFrameItemExt {
  forceCharacterAction: CharacterAction;
  forceCharacterActionFrameIndex: number;
  forceCharacterFace: CharacterExpressions;
  forceCharacterFaceFrameIndex: number;
  forceCharacterFlip: number;
  tamingMobRear: WzPngPieceInfo;
}

export interface WzPngPieceInfo {
  origin: Vec2;
  map?: Record<string, Vec2>;
  lt?: Vec2;
  rb?: Vec2;
  z: number;
  _outlink?: string;
  _inlink?: string;
  path?: string;
}
