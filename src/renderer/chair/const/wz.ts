import type { Vec2 } from './data';
import type { CharacterAction } from '@/const/actions';
import type { CharacterExpressions } from '@/const/emotions';

export type WzChairData = { info: WzChairInfo } & WzChairEffectSets &
  Record<string, WzChairEffectSets> & {
    seteffect?: WzChairEffectItem;
    pos?: number;
    mesoChair?: unknown;
    effect_spine?: unknown;
    particle?: unknown;
  };

export interface WzChairCustomInfo {
  chatBalloonMove?: Vec2;
  scaleAvatar?: number;
  avatar?: Record<number, WzChairCustomMovingInfo>;
  avatarCount?: number;
  self?: WzChairCustomMovingInfo;
  type?: string;
}

export interface WzChairCustomMovingInfo {
  left?: number;
  pos: Vec2;
  tamingMob?: number;
  z?: number;
}

export interface WzChairInfo {
  bodyRelMove?: Vec2;
  floatingBodyRelMove?: Vec2;
  chatballonRelMove?: Vec2;
  sitAction?: CharacterAction;
  sitEmotion?: CharacterExpressions;
  customChair?: unknown;

  tamingMob?: number;

  distanceX?: number;
  distanceY?: number;

  face?: number;
  flip?: number;
  direction?: number;
  /* booleans, 1 for true */
  randomChair?: number;
  randEffect?: number;
  sitLeft?: number;
  sitRight?: number;
  removeBody?: number;
  removeEffectAll?: number;
  removeEffectBodyParts?: number;
  removeSoulEffect?: number;
  removeCharacterInfo?: number;
  forcedHideNick?: number;
  forcedVisible?: number;

  invisibleCape?: number;
  invisibleWeapon?: number;
  invisibleTail?: number;
  invisibleMonkey?: number;

  /* some not checked properties */
  textInfo?: unknown;
  nameInfo?: unknown;
  bgmInfo?: unknown;
  weapon?: unknown;
  group?: unknown;
  fixFrameIdx?: number;
}

export interface WzChairEffectSets {
  effect: WzChairEffectItem; // at lease have this one
  effect2?: WzChairEffectItem;
  effect3?: WzChairEffectItem;
}

export type WzRandomEffect = WzChairEffectSets;

export type WzChairEffectItem = Record<number, WzPngPieceInfo> & {
  bodyRelMove?: Vec2;
  pos?: number;
  z?: number;
};

export interface WzPngPieceInfo {
  origin: Vec2;
  z: number;
  _outlink?: string;
  _inlink?: string;
  path?: string;
}
