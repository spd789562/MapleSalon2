import type { WzPngPieceInfo } from '@/renderer/map/const/wz';

export interface WzParticleData {
  DeltaTime: number;
  totalParticle: number;
  angle: number;
  angleVar: number;
  blendFuncSrc: ParticleBlendFunc;
  blendFuncDst: ParticleBlendFunc;
  duration: number;
  startColor: number;
  startColorVar: number;
  endColor: number;
  endColorVar: number;
  MiddlePoint0: number;
  MiddlePoint1: number;
  MiddlePointAlpha0: number;
  MiddlePointAlpha1: number;
  startSize: number;
  startSizeVar: number;
  endSize: number;
  endSizeVar: number;
  posX: number;
  posY: number;
  posVarX: number;
  posVarY: number;
  startSpin: number;
  startSpinVar: number;
  endSpin: number;
  endSpinVar: number;
  life: number;
  lifeVar: number;
  positionType: 0 | 1 | 2 | 3;
  opacityModifyRGB: number;
  texture: WzPngPieceInfo;
  GRAVITY: WzParticleGravityData;
  RADIUS: WzParticleRadiusData;
}

export interface WzParticleGravityData {
  x: number;
  y: number;
  speed: number;
  speedVar: number;
  radialAccel: number;
  radialAccelVar: number;
  tangentialAccel: number;
  tangentialAccelVar: number;
  rotationIsDir: number; // 0 or 1
}

export interface WzParticleRadiusData {
  startRadius: number;
  startRadiusVar: number;
  endRadius: number;
  endRadiusVar: number;
  rotatePerSecond: number;
  rotatePerSecondVar: number;
}

export enum ParticleBlendFunc {
  ZERO = 1,
  ONE = 2,
  SRC_COLOR = 3,
  ONE_MINUS_SRC_COLOR = 4,
  SRC_ALPHA = 5,
  ONE_MINUS_SRC_ALPHA = 6,
  DST_ALPHA = 7,
  ONE_MINUS_DST_ALPHA = 8,
  DST_COLOR = 9,
  ONE_MINUS_DST_COLOR = 10,
  SRC_ALPHA_SATURATE = 11,
}
