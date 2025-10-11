import { Assets, Container, AnimatedSprite, type PointData } from 'pixi.js';

import type { WzAnimatedMedalData } from './wz';

import { MedalPiece } from './medalPiece';

export class MedalAnimatedBackground extends Container {
  wz: WzAnimatedMedalData['ani'];
  pieces: MedalPiece[] = [];
  animatedSprite?: AnimatedBackground;

  constructor(wz: WzAnimatedMedalData) {
    super();
    this.wz = wz.ani;

    const aniFrameKeys = Object.keys(wz.ani || {})
      .map((key) => Number(key))
      .filter((key) => !Number.isNaN(key));

    for (const key of aniFrameKeys) {
      const piece = new MedalPiece(wz.ani[key]);
      this.pieces.push(piece);
    }
  }
  play() {
    this.animatedSprite?.play();
  }
  stop() {
    this.animatedSprite?.gotoAndStop(0);
  }
  get totalDuration() {
    return this.animatedSprite?.totalDuration ?? 0;
  }
  get timeline() {
    return this.animatedSprite?.timeline || [];
  }
  resetFrame() {
    if (this.animatedSprite) {
      this.animatedSprite.currentFrame = 0;
      /* @ts-ignore */
      this.animatedSprite._currentTime = 0;
    }
  }
  async prepareResource() {
    const resource = Array.from(this.pieces.values())
      .flat()
      .flatMap((piece) => piece?.getResource() || []);

    for (const res of resource) {
      if (res) {
        await Assets.load(res);
      }
    }
    if (this.pieces.length > 0) {
      this.animatedSprite = new AnimatedBackground(this.pieces);
    }
  }
  renderBackground() {
    if (!this.animatedSprite) {
      return;
    }
    this.addChild(this.animatedSprite);
    this.animatedSprite.play();
  }
}

class AnimatedBackground extends AnimatedSprite {
  origins: PointData[] = [];
  constructor(pieces: MedalPiece[]) {
    const textures = pieces.map((piece) => ({
      texture: piece.getTexture(),
      time: piece.delay || 120,
    }));
    super(textures);
    this.loop = true;
    this.origins = pieces.map((piece) => piece.origin);
    this.onFrameChange(0);
  }
  get timeline() {
    /* @ts-ignore */
    return (this._durations as number[]).reduce((acc, delay) => {
      const prev = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(prev + delay);
      return acc;
    }, [] as number[]);
  }
  get totalDuration() {
    /* @ts-ignore */
    return (this._durations as number[]).reduce((acc, curr) => acc + curr, 0);
  }
  onFrameChange = (currentFrame: number) => {
    const origin = this.origins[currentFrame];
    this.pivot.copyFrom(origin);
  };
}
