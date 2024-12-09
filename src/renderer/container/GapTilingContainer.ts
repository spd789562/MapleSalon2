import {
  Point,
  Container,
  Sprite,
  Texture,
  AnimatedSprite,
  type PointData,
} from 'pixi.js';

export interface CloneableContainer extends Container {
  clone(): CloneableContainer;
}

export enum TileMode {
  None = '0',
  Horizontal = '1',
  Vertical = '2',
  Both = '3',
}

abstract class GapTilingBase<T extends Container> extends Container {
  target: T;
  grid: Container[][] = [];
  _distence = new Point(0, 0);
  _mask = new Sprite(Texture.WHITE);
  _tilePosition;
  maxXcount: number;
  maxYcount: number;
  mode: TileMode;
  constructor(options: {
    target: T;
    size: { width: number; height: number };
    gap: PointData;
    mode: TileMode;
  }) {
    super();
    const { target, size, gap, mode } = options;
    this.target = target;
    this.mode = mode;
    const width = mode === TileMode.Vertical ? target.width : size.width;
    const height = mode === TileMode.Horizontal ? target.height : size.height;
    this._tilePosition = new Point(target.pivot.x, target.pivot.y);

    this._distence.set(target.width + gap.x, target.height + gap.y);
    this.maxXcount = Math.ceil(width / this._distence.x) + 1;
    this.maxYcount = Math.ceil(height / this._distence.y) + 1;

    this.initializeTiling();

    const mask = new Sprite(Texture.WHITE);
    mask.width = width;
    mask.height = height;
    this.mask = mask;
    this._mask = mask;
    this.addChild(mask);
  }
  abstract initializeTiling(): void;
  abstract cloneTarget(): T;
  get tilePosition() {
    return this._tilePosition;
  }
  set tilePosition(point: PointData) {
    // this._tilePosition.x %= this._distence.x;
    // this._tilePosition.y %= this._distence.y;
    this._tilePosition.copyFrom(point);
    this.positionUpdate();
  }
  set size({ width, height }: { width: number; height: number }) {
    this._mask.width = width;
    this._mask.height = height;
    // this.maxXcount = Math.ceil(width / this._distence.x) + 1;
    // this.maxYcount = Math.ceil(height / this._distence.y) + 1;
    this.positionUpdate();
  }
  positionUpdate() {
    const basePoint = {
      x: 0,
      y: 0,
    };
    let tileCountX = 1;
    let tileCountY = 1;

    // horizontal and both
    if (this.mode !== TileMode.Vertical) {
      let x = this._tilePosition.x % this._distence.x;
      if (x > 0) {
        x -= this._distence.x;
      }
      basePoint.x = x;
      tileCountX =
        Math.ceil((this._mask.width + basePoint.x) / this._distence.x) + 1;
    }

    // vertical and both
    if (this.mode !== TileMode.Horizontal) {
      let y = this._tilePosition.y % this._distence.y;
      if (y > 0) {
        y -= this._distence.y;
      }
      basePoint.y = y;
      tileCountY =
        Math.ceil((this._mask.height + basePoint.y) / this._distence.y) + 1;
    }

    let index = 0;
    for (let i = 0; i < tileCountX; i++) {
      for (let j = 0; j < tileCountY; j++) {
        // ensure the children
        if (this.children[index] === undefined) {
          this.addChild(this.cloneTarget());
        }
        const child = this.children[index];
        child.position.set(
          basePoint.x + j * this._distence.x,
          basePoint.y + i * this._distence.y,
        );

        index += 1;
      }
    }
    if (this.children.length > index) {
      const removed = this.removeChildren(index);
      // for (const child of removed) {
      //   child.destroy();
      // }
    }
  }
}

export class GapTilingContainer extends GapTilingBase<CloneableContainer> {
  initializeTiling() {
    for (let i = 0; i < this.maxYcount; i++) {
      for (let j = 0; j < this.maxXcount; j++) {
        const cloned = this.cloneTarget();
        cloned.position.set(j * this._distence.x, i * this._distence.y);
        if (this.grid[i] === undefined) {
          this.grid[i] = [];
        }
        this.grid[i].push(cloned);
        this.addChild(cloned);
      }
    }
  }
  cloneTarget() {
    return this.target.clone();
  }
}
export class GapTilingAnimatedSprite extends GapTilingBase<AnimatedSprite> {
  initializeTiling() {
    for (let i = 0; i < this.maxYcount; i++) {
      for (let j = 0; j < this.maxXcount; j++) {
        const cloned = this.cloneTarget();
        cloned.position.set(j * this._distence.x, i * this._distence.y);
        if (this.grid[i] === undefined) {
          this.grid[i] = [];
        }
        this.grid[i].push(cloned);
        this.addChild(cloned);
      }
    }
  }
  cloneTarget() {
    const sprite = new AnimatedSprite(this.target.textures);
    /* @ts-ignore */
    sprite._durations = this.target._durations;
    sprite.onFrameChange = (frame) => {
      sprite.pivot.set(
        /* @ts-ignore */
        this.target._origins[frame]?.x || 0,
        /* @ts-ignore */
        this.target._origins[frame]?.y || 0,
      );
    };
    sprite.play();
    return sprite;
  }
}

export class GapTilingSprite extends GapTilingBase<Sprite> {
  initializeTiling() {
    for (let i = 0; i < this.maxYcount; i++) {
      for (let j = 0; j < this.maxXcount; j++) {
        const cloned = this.cloneTarget();
        cloned.position.set(j * this._distence.x, i * this._distence.y);
        if (this.grid[i] === undefined) {
          this.grid[i] = [];
        }
        this.grid[i].push(cloned);
        this.addChild(cloned);
      }
    }
  }
  cloneTarget() {
    return Sprite.from(this.target.texture);
  }
}
