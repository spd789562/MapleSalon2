import type { Vec2 } from './data';

export type WzMapData = {
  back: Record<number, WzMapBackInfo>;
  foothold?: Record<number, Record<number, Record<number, WzMapFootholdInfo>>>;
  ladderRope?: Record<number, WzMapLadderInfo>;
  portal?: Record<number, WzMapPortalInfo>;
  miniMap: WzMapMiniMapInfo;
  life?: unknown;
  reactor?: unknown;
  info: WzMapInfoData;
} & WzMapLayer;

export type WzMapLayer = Record<number, WzMapLayerInfo>;

export interface WzMapInfoData {
  VRBottom: number;
  VRLeft: number;
  VRRight: number;
  VRTop: number;

  bgm?: string;
  cloud?: number;
}

export interface WzMapLayerInfo {
  info: {
    tS: string;
  };
  obj?: Record<number, WzMapObjInfo>;
  tile?: Record<number, WzMapTileInfo>;
}

export interface WzMapBackInfo {
  /** back {bS}.img name */
  bS: string;
  /** {bS}.img/back/{no}  */
  no: number;
  /** ani === 1 use {bS}.img/ani else {bS}.img/back */
  ani: number;
  /** flip 0 or 1 */
  f: number;
  /** alpha 0~255 */
  a: number;
  /* will do repeatlly tiling 0=no 1,4=repeat-x 2,5=repeat-y */
  type: number;

  /* foreground */
  front?: number;

  x: number;
  y: number;
  /** offset base on character's camera */
  rx: number;
  ry: number;
  /** gap when do coping */
  cx: number;
  cy: number;
  /** moving speed */
  flowX?: number;
  flowY?: number;
}

export interface WzMapObjInfo {
  /** obj {oS}.img name */
  oS: string;
  /** {oS}.img/{l0}/{l1}/{l2} */
  l0: string;
  l1: string;
  l2: string;
  /** index of layer 0-9 */
  layer?: number;
  x: number;
  y: number;
  z: number;
  /** flip 0 or 1 */
  f: number;
  /** moving 0 or 1 */
  move: number;

  spineAni?: string;

  /* not sure */
  flow?: number;
  dynamic?: number;
  name?: string;
  piece: number;
  zM: number;
  r: number;
}

export interface WzMapTileInfo {
  /** {tS}.img/{u} */
  u: string;
  /** {tS}.img/{u}/{no} */
  no: number;
  x: number;
  y: number;
  z?: number;
  zM: number;
}

export interface WzMapMiniMapInfo {
  canvas: WzPngPieceInfo;
  centerX: number;
  centerY: number;
  height: number;
  width: number;
  mag: number;
}

export interface WzMapPortalInfo {
  pn: string;
  tn: string;
  pt: number;
  tm: number;
  x: number;
  y: number;
}

export interface WzMapLadderInfo {
  l: number;
  uf: number;
  x: number;
  y1: number;
  y2: number;
  page: number;
  piece: number;
}

export interface WzMapFootholdInfo {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
  piece: number;
  next: number;
  prev: number;
}

export type WzMapObjTypeFolder = Record<string, WzMapObjFolder>;
export type WzMapObjFolder = Record<string, WzMapObjData>;
export type WzMapObjData = WzMapObjFrames & Record<string, WzMapObjFrames>;
export type WzMapObjFrames = Record<string, WzPngPieceInfo>;

export type WzMapBackStaticFolder = Record<string, WzPngPieceInfo>;
export type WzMapBackAniFolder = Record<string, Record<number, WzPngPieceInfo>>;

export type WzMapTileFolder = Record<string, Record<string, WzPngPieceInfo>>;

export interface WzPngPieceInfo {
  origin: Vec2;
  z: number;
  _outlink?: string;
  _inlink?: string;
  path?: string;
  delay?: number;
}
