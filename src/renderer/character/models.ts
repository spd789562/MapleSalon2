export interface Vec2 {
  x: number;
  y: number;
}

export type AncherName = string;
export type AncherMap = Record<AncherName, Vec2>;

export type CharacterExpression = string;

export enum CharacterAction {
  Stand1 = 'stand1',
  Stand2 = 'stand2',
  Walk1 = 'walk1',
  Walk2 = 'walk2',
  Alert = 'alert',
  Fly = 'fly',
  Heal = 'heal',
  Jump = 'jump',
  Ladder = 'ladder',
  Rope = 'rope',
  Prone = 'prone',
  ProneStab = 'proneStab',
  Shoot1 = 'shoot1',
  Shoot2 = 'shoot2',
  ShootF = 'shootF',
  Sit = 'sit',
  StabO1 = 'stabO1',
  StabO2 = 'stabO2',
  StabOF = 'stabOF',
  StabT1 = 'stabT1',
  StabT2 = 'stabT2',
  StabTF = 'stabTF',
  SwingO1 = 'swingO1',
  SwingO2 = 'swingO2',
  SwingO3 = 'swingO3',
  SwingOF = 'swingOF',
  SwingP1 = 'swingP1',
  SwingP2 = 'swingP2',
  SwingPF = 'swingPF',
  SwingT1 = 'swingT1',
  SwingT2 = 'swingT2',
  SwingT3 = 'swingT3',
  SwingTF = 'swingTF',
}

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
export type Smap = Record<PieceSlot, PieceSlot[]>;

export interface ItemDyeInfo {
  color: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
  alpha: number;
}

/** base item information */
export interface ItemInfo {
  id: number;

  visible?: boolean;

  alpha?: number;

  hue?: number;
  saturation?: number;
  brightness?: number;
  contrast?: number;

  dye?: ItemDyeInfo;
}

export interface RenderItemInfo {
  info: ItemInfo;
  pieces: Map<PieceName, RenderPieceInfo[]>;
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

export type WzItem = Record<CharacterAction, Record<number, WzPieceFrame>> & {
  info: WzItemInfo;
};
export interface WzItemInfo {
  cash?: boolean;
  islot: string;
  vslot: string;
  colorvar: boolean;
  royalSpecial: boolean;
}

export type WzPieceFrame = Record<PieceName, WzPieceInfo> & {
  delay: number;
};

/** PieceInfo structure in wz */
export interface WzPieceInfo {
  origin: Vec2;
  z: PieceZ;
  _outlink?: string;
  _inlink?: string;
  group?: PieceGroup;
  map?: AncherMap;
  url?: string;
}
