import {
  AnimatedSprite,
  Assets,
  Container,
  ContainerChild,
  Sprite,
  Texture,
  Ticker,
  type UnresolvedAsset,
} from 'pixi.js';
import type { AncherName, Vec2 } from './character/const/data';

export interface AnimatableFrame {
  getTexture(): Texture;
  getRenderAble(): Container;
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
  zIndex = -1;

  getTexture() {
    return Texture.EMPTY;
  }

  getRenderAble() {
    return Sprite.from(Texture.EMPTY);
  }

  getResource() {
    return null;
  }

  buildAncher() {}
}

export abstract class BaseAnimatablePart<
  Frame extends AnimatableFrame,
> extends Container {
  frames: Frame[] = [];
  textures: Container[] = [];

  loop = true;

  /** The speed that the BaseAnimatablePart will play at. Higher is faster, lower is slower.  */
  animationSpeed = 1;

  private _playing = false;
  private _isConnectedToTicker = false;

  private _currentTime: number;
  private _previousFrame: number | null;

  onFrameChange?: (currentFrame: number) => void;
  onLoop?: () => void;
  onComplete?: () => void;

  constructor(frames: Frame[]) {
    super();
    this.frames = frames;
    this.textures = frames.map((frame) => frame.getRenderAble());
    this._currentTime = 0;
    this._previousFrame = null;
    this._updateFrame();
  }

  stop() {
    if (!this._playing) {
      return;
    }

    this._playing = false;

    if (this._isConnectedToTicker) {
      Ticker.shared.remove(this.update, this);
      this._isConnectedToTicker = false;
    }
  }

  play() {
    if (this._playing) {
      return;
    }

    this._playing = true;

    if (!this._isConnectedToTicker) {
      Ticker.shared.add(this.update, this);
      this._isConnectedToTicker = true;
    }
  }

  update(ticker: Ticker) {
    if (this._playing) {
      return;
    }
    const deltaTime = ticker.deltaTime;
    const elapsed = this.animationSpeed * deltaTime;
    const previousFrame = this.currentFrame;

    /* [pixi lag] start, logic from pixi.js AnimatedSprite */

    let lag = (this._currentTime % 1) * this.currentDuration;

    // Adjust the lag based on elapsed time.
    lag += (elapsed / 60) * 1000;

    // If the lag is negative, adjust the current time and the lag.
    while (lag < 0) {
      this._currentTime--;
      lag += this.currentDuration;
    }

    const sign = Math.sign(this.animationSpeed * deltaTime);

    // Floor the current time to get a whole number frame.
    this._currentTime = Math.floor(this._currentTime);

    // Adjust the current time and the lag until the lag is less than the current frame's duration.
    while (lag >= this.currentDuration) {
      lag -= this.currentDuration * sign;
      this._currentTime += sign;
    }

    // Adjust the current time based on the lag and current frame's duration.
    this._currentTime += lag / this.currentDuration;

    /* [pixi lag] end */

    if (this._currentTime < 0 && !this.loop) {
      this._currentTime = 0;
      this._playing = false;
      this.onComplete?.();
    } else if (this._currentTime >= this.textures.length && !this.loop) {
      this._playing = false;
      this.onComplete?.();
    } else if (previousFrame !== this.currentFrame) {
      if (this.loop && this.onLoop) {
        if (this.currentFrame < previousFrame) {
          this.onLoop();
        }
      }
      this._updateFrame();
    }
  }

  private _updateFrame() {
    const currentFrame = this.currentFrame;
    if (this._previousFrame === currentFrame) {
      return;
    }

    this._previousFrame = currentFrame;

    if (this.children.length) {
      this.removeChildAt(0);
    }
    this.addChildAt(this.textures[currentFrame], 0);

    this.onFrameChange?.(this.currentFrame);
  }

  gotoAndStop(frame: number) {
    this.stop();
    this.currentFrame = frame;
  }
  gotoAndPlay(frame: number) {
    this.currentFrame = frame;
    this.play();
  }

  get playing() {
    return this._playing;
  }

  get totalFrames() {
    return this.frames.length;
  }

  get currentFrame() {
    let currentFrame = Math.floor(this._currentTime) % this.frames.length;

    if (currentFrame < 0) {
      currentFrame += this.frames.length;
    }

    return currentFrame;
  }

  set currentFrame(value: number) {
    if (value < 0 || value > this.totalFrames - 1) {
      throw new Error(
        `[BaseAnimatablePart]: Invalid frame index value ${value}, ` +
          `expected to be between 0 and totalFrames ${this.totalFrames}.`,
      );
    }

    const previousFrame = this.currentFrame;

    this._currentTime = value;

    if (previousFrame !== this.currentFrame) {
      this._updateFrame();
    }
  }

  get currentDuration() {
    return this.frames[this.currentFrame].delay || 60;
  }
}

export class AnimatablePart<Frame extends AnimatableFrame = AnimatableFrame> extends BaseAnimatablePart<Frame> {

  constructor(frames: Frame[]) {
    super(frames);
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
