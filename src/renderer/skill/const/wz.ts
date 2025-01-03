import type { Vec2 } from './data';
import type { CharacterAction } from '@/const/actions';

export type WzSkillData = {
  action?: WzSkillAction;
  info?: WzSkillInfo;
  /* booleans */
  randomEffect?: number;
  invisible?: number;
} & WzSkillEffect &
  WzSkillScreenEffect &
  WzSkillKeyDownEffect &
  WzSkillPrepareEffect &
  WzSkillSpecialEffect;

export type WzSkillAction = Record<number, CharacterAction | string>;

export type WzSkillPngSet = Record<number, WzPngPieceInfo>;
export type WzSkillPngSets = Record<number, WzSkillPngSet>;
export type WzSkillSetOrSets = WzSkillPngSet | WzSkillPngSets;

export type WzSkillEffect = {
  effect?: WzSkillSetOrSets;
} & Record<`effect${number}`, WzSkillSetOrSets>;

export type WzSkillScreenEffect = {
  screen?: WzSkillSetOrSets;
} & Record<`screen${number}`, WzSkillSetOrSets>;

export type WzSkillKeyDownEffect = {
  keydown?: WzSkillSetOrSets;
} & Record<`keydown${number}`, WzSkillSetOrSets>;

export type WzSkillPrepareEffect = {
  prepare?: WzSkillSetOrSets;
} & Record<`prepare${number}`, WzSkillSetOrSets>;

export type WzSkillSpecialEffect = {
  special?: WzSkillSetOrSets;
} & Record<`special${number}`, WzSkillSetOrSets>;

export interface WzSkillInfo {
  avaliableInJumpingState?: number;
}

export interface WzPngPieceInfo {
  origin: Vec2;
  z: number;
  _outlink?: string;
  _inlink?: string;
  path?: string;
  delay?: number;
  width: number;
  height: number;
}
