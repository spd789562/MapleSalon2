import {
  Assets,
  Container,
  AnimatedSprite,
  type PointData,
  type FrameObject,
} from 'pixi.js';

import type { WzAnimatedNameTagData } from './wz';

import { NameTagPiece } from './nameTagPiece';

export enum AnimatedSize {
  Small = 0,
  Medium = 1,
  Large = 2,
}

export class NameTagAnimatedBackground extends Container {
  wz?: WzAnimatedNameTagData;
  size: AnimatedSize = AnimatedSize.Medium;
  pieces = new Map<AnimatedSize, NameTagPiece[]>();
  preparedSprite = new Map<AnimatedSize, AnimatedSprite>();
  _nameWidth = 30;

  type = 'animated';
  get topOffset() {
    return this.wz?.heightoffset || 0;
  }
  play() {
    const sprite = this.preparedSprite.get(this.size);
    if (sprite) {
      sprite.play();
    }
  }
  stop() {
    const sprite = this.preparedSprite.get(this.size);
    if (sprite) {
      sprite.gotoAndStop(0);
    }
  }
  reset() {
    this.pieces.clear();
    for (const sprite of this.preparedSprite.values()) {
      sprite.destroy();
    }
  }
  get totalDuration() {
    const currentSprite = this.preparedSprite.get(
      this.size,
    ) as SizedAnimatedBackground;
    return currentSprite?.totalDuration || 0;
  }
  resetFrame() {
    const currentSprite = this.preparedSprite.get(this.size);
    if (currentSprite) {
      currentSprite.currentFrame = 0;
      /* @ts-ignore */
      currentSprite._currentTime = 0;
    }
  }
  updatePiece(wz: WzAnimatedNameTagData) {
    this.wz = wz;
    this.reset();
    for (const size in AnimatedSize) {
      if (wz[size]) {
        const pieces = [];
        for (const frameKey in wz[size]) {
          const parsed = Number.parseInt(frameKey);
          if (Number.isNaN(parsed)) {
            continue;
          }
          const piece = new NameTagPiece(wz[size][parsed]);
          pieces.push(piece);
        }
        this.pieces.set(Number(size), pieces);
      }
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

    for (const [size, pieces] of this.pieces) {
      const sprite = new SizedAnimatedBackground(pieces);
      this.preparedSprite.set(size, sprite);
    }
  }
  renderBackground() {
    const size = this.getUseableSize();
    const sprite = this.preparedSprite.get(size);
    if (sprite) {
      const currentSprite = this.preparedSprite.get(this.size);
      if (currentSprite && this.size !== size) {
        currentSprite.stop();
        this.removeChild(currentSprite);
      }

      this.size = size;
      this.addChild(sprite);
      sprite.play();
    }
  }
  set nameWidth(width: number) {
    this._nameWidth = width;
  }
  getUseableSize() {
    const hasSmall = this.preparedSprite.has(AnimatedSize.Small);
    if (this._nameWidth <= 32 && hasSmall) {
      return AnimatedSize.Small;
    }
    const hasMedium = this.preparedSprite.has(AnimatedSize.Medium);
    if (this._nameWidth <= 64 && hasMedium) {
      return AnimatedSize.Medium;
    }
    if (!this.preparedSprite.has(AnimatedSize.Large)) {
      if (hasMedium) {
        return AnimatedSize.Medium;
      }
      if (hasSmall) {
        return AnimatedSize.Small;
      }
      // what? u shouldn't be here
    }
    return AnimatedSize.Large;
  }
}

class SizedAnimatedBackground extends AnimatedSprite {
  origins: PointData[] = [];
  constructor(pieces: NameTagPiece[]) {
    const textures = pieces.map((piece) => ({
      texture: piece.getTexture(),
      time: piece.delay || 60,
    }));
    super(textures);
    this.loop = true;
    this.origins = pieces.map((piece) => piece.origin);
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
