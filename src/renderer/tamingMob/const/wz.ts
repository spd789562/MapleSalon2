import type { Vec2 } from './data';
import type { CharacterAction } from '@/const/actions';
import type { CharacterExpressions } from '@/const/emotions';

export type WzTamingMobData = {
  info: WzTamingMobInfo;
  characterAction?: WzTamingMobActionMap;
  forcingItem?: Record<number, number>;
} & Record<CharacterAction | string, Record<number, WzTamingMobFrameItem>>;

export type WzTamingMobActionMap = Record<CharacterAction, CharacterAction>;

export interface WzTamingMobInfo {
  /* i'm not sure what this do */
  tamingMob?: number;

  passengerNum?: number;
  slotMax?: number;
  scale?: number;
  forcingItem?: number;

  /* booleans, 1 for true */
  removeBody?: number;
  removeEffect?: number;
  removeEffectAll?: number;
  removeJobWing?: number;
  removeSoulEffect?: number;
  flip?: number;
  fixFlip?: number;
  forceCharacterFlip?: number;
  ActionEffect?: number;

  invisibleWeapon?: number;
  invisibleCape?: number;
  invisibleTail?: number;

  hideEar?: number;

  pachinko?: number; // what even this do?

  /* custom */
  partsCount?: number;
  customVehicle?: WzTamingMobCustom;
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
  tamingMobFront: WzPngPieceInfo;
}

export interface WzPngPieceInfo {
  origin: Vec2;
  map?: Record<string, Vec2>;
  lt?: Vec2;
  rb?: Vec2;
  z: number | string;
  _outlink?: string;
  _inlink?: string;
  path?: string;
  width: number;
  height: number;
}

export interface WzTamingMobCustom {
  type: string;
  togetherVehicleInfo?: WzTamingMobCustomInfo;
}

export interface WzTamingMobCustomInfo {
  avatarCount?: number;
  avatarInfo: Record<number, WzTamingMobCustomMovingInfo>;
}

export interface WzTamingMobCustomMovingInfo {
  left?: number;
  pos: {
    default: Vec2;
    ladder?: Vec2;
    rope?: Vec2;
  };
  z?: number;
}
