import { AnimatedSprite, Assets, Texture, type UnresolvedAsset } from 'pixi.js';
import type { AncherName, Vec2 } from './character/const/data';

export interface AnimatableFrame {
  getTexture(): Texture;
  getResource(): UnresolvedAsset | null;
  buildAncher(frameAncherMap: Map<AncherName, Vec2>): void;
  position: {
    x: number;
    y: number;
  };
  delay: number;
  baseAncherName: AncherName;
  isAncherBuilt: boolean;
  zIndex: number;
}

export class EmptyFrame implements AnimatableFrame {
  position = { x: 0, y: 0 };
  delay = 100;
  baseAncherName: AncherName = 'navel';
  isAncherBuilt = true;
  zIndex = 0;

  getTexture() {
    return Texture.EMPTY;
  }

  getResource() {
    return null;
  }

  buildAncher() {}
}


export class AnimatablePart extends AnimatedSprite {
  frames: AnimatableFrame[] = [];

  constructor(frames: AnimatableFrame[]) {
    super([Texture.EMPTY]);
    this.frames = frames;
    this.textures = frames.map((frame) => ({
      texture: frame.getTexture(),
      time: frame.delay,
    }));
    this.updatePositionByFrame(0);
    this.onFrameChange = this.frameChanges.bind(this);
  }

  getCurrentDelay() {
    return this.frames[this.currentFrame].delay;
  }

  updatePositionByFrame(currentFrame: number) {
    this.position.copyFrom(this.frames[currentFrame].position);
  }
  frameChanges(currentFrame: number) {
    this.updatePositionByFrame(currentFrame);
  }

  get resources() {
    return this.frames
      .map((frame) => frame.getResource())
      .filter((r) => r) as UnresolvedAsset[];
  }

  get isAllAncherBuilt() {
    return !this.frames.some((frame) => !frame.isAncherBuilt);
  }

  async prepareResource() {
    await Assets.load(this.resources);
  }
}
