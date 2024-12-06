import type { PointData } from 'pixi.js';

export type WzSpineData = Record<string, WzPngPieceInfo> &
  Record<string, string>;

export interface WzPngPieceInfo {
  origin: PointData;
  z: number;
  _outlink?: string;
  _inlink?: string;
  path?: string;
  delay?: number;
}
