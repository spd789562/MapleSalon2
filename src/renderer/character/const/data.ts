import type { ColorRange } from '@/renderer/filter/hsvAdjustmentFilter';

export interface Vec2 {
  x: number;
  y: number;
}

export type AncherName = string;
export type AncherMap = Record<AncherName, Vec2>;

/** the required slot of an item  */
export type PieceIslot =
  | 'Bd'
  | 'Hd'
  | 'Hr'
  | 'Fc'
  | 'At'
  | 'Af'
  | 'Am'
  | 'Ae'
  | 'As'
  | 'Ay'
  | 'Cp'
  | 'Ri'
  | 'Gv'
  | 'Wp'
  | 'Si'
  | 'So'
  | 'Pn'
  | 'Ws'
  | 'Ma'
  | 'Wg'
  | 'Sr'
  | 'Tm'
  | 'Sd';
/** the slot will block by current item */
export type PieceVslot = string;
export type PieceZ = string;
/** the name of piece under every item's action like hair, hairBelowBody */
export type PieceName = string;
export type PieceSlot = PieceName | PieceZ;
export type PieceGroup = string;

export type Zmap = PieceSlot[];
export type Smap = Record<PieceSlot, string>;

export type DyeColor = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export interface ItemDyeInfo {
  color: DyeColor;
  alpha: number;
}

/** base item information */
export interface ItemInfo {
  id: number;

  enableEffect?: boolean;
  visible?: boolean;

  alpha?: number;

  colorRange?: ColorRange;
  hue?: number;
  saturation?: number;
  brightness?: number;
  contrast?: number;

  dye?: ItemDyeInfo;
}

export interface RenderItemInfo {
  info: ItemInfo;
  /** the required slots of this item  */
  islot: PieceIslot[];
  /** the slots will block by current item */
  vslot: PieceVslot[];
}

/* the actual rendered stuff */
export interface RenderPieceInfo {
  info: ItemInfo;

  /** assets url */
  url?: string;

  group?: PieceGroup;

  z: PieceZ;

  /** the z index name in Zmap, it might z or slotName of it parent */
  slot: PieceSlot;

  /** piece offset base on ancher */
  origin: Vec2;

  /** ancher mapping */
  map: AncherMap;

  delay: number;
}
