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

export type WzChairEffectData = Record<
  number,
  Record<number, WzChairEffectItem> | WzChairEffectItem
>;

export interface WzChairInfo {
  bodyRelMove?: Vec2;
  floatingBodyRelMove?: Vec2;
  chatballonRelMove?: Vec2;
  sitAction?: CharacterAction;
  sitEmotion?: CharacterExpressions;
  customChair?: WzChairCustomInfo;

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
  removeEffect?: number;
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

  /* invite other player */
  group?: WzChairGroupData;

  /* lv chair contains character in same server of a account */
  lvChairInfo?: WzChairLvData;

  /* some not checked properties */
  textInfo?: unknown;
  nameInfo?: unknown;
  bgmInfo?: unknown;
  weapon?: unknown;
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
  delay?: number;
}

export interface WzChairCustomInfo {
  chatBalloonMove?: Vec2;
  scaleAvatar?: number;
  avatar?: Record<number, WzChairCustomMovingInfo>;
  avatarCount?: number;
  self?: WzChairCustomMovingInfo;
  type?: string;
  androidChairInfo?: WzChairAndroidData;
  female?: { tamingMob: number };
  male?: { tamingMob: number };
}

export interface WzChairCustomMovingInfo {
  left?: number;
  pos: Vec2;
  tamingMob?: number;
  z?: number;
}

export interface WzChairGroupData {
  info: {
    width: number;
    height: number;
  };
  sit: Record<number, WzChairGroupCharacterData>;
  random?: {
    emotion: Record<number, number>;
  };
}

export interface WzChairGroupCharacterData {
  sitAction?: CharacterAction;
  bodyRelMove?: Vec2;
  dir?: number;
  sitLeft?: number;
  tamingMobF?: number;
  tamingMobM?: number;
}

export interface WzChairLvData {
  avatarCount: number;
  avatarGap?: number;
  startPos?: Vec2;
  avatarStartPos?: Vec2;

  avatarLeft?: Record<number, number>; // 0 | -1
  avatarPos?: Record<number, Vec2>;
  sitAction?: Record<number, CharacterAction>; // ex: 03018599, this somehow contains stand not stand1 or stand2

  /* 
    `forcedHideBody${avatarIndex}`: number;
    `forcedAction${avatarIndex}`: number;
    `forcedPos${avatarIndex}`: number
    `forcedLeft${avatarIndex}`: number
   */

  forcedHideBody0?: number; //example: 03018810, 03018453
  forcedHideBody1?: number;
  forcedHideBody2?: number;
  forcedHideBody3?: number;
  forcedHideBody4?: number;
  forcedAction0?: CharacterAction;
  forcedAction1?: CharacterAction;
  forcedAction2?: CharacterAction;
  forcedAction3?: CharacterAction;
  forcedAction4?: CharacterAction;
  forcedLeft0?: number; // example: 03018284
  forcedLeft1?: number;
  forcedLeft2?: number;
  forcedLeft3?: number;
  forcedLeft4?: number;
  forcedPos0?: number;
  forcedPos1?: number;
  forcedPos2?: number;
  forcedPos3?: number;
  forcedPos4?: number;

  /* boolean */
  invisibleWeapon?: number;
  zeroAloneCheck?: number;

  /* ignored */
  lvText?: unknown;
  chairType?: string;
}

export interface WzChairAndroidData {
  customEffect?: WzChairEffectItem;
  forcedAction?: CharacterAction;
  forcedHideBody?: number;
  pos?: Vec2;
  reverseFlip?: number;
}

export interface WzEventPointChairData {
  femail: { tamingMob: number };
  male: { tamingMob: number };
  type: string;
}
