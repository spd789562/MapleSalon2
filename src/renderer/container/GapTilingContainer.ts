import {
  Point,
  Container,
  Sprite,
  Texture,
  AnimatedSprite,
  type PointData,
  type DestroyOptions,
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
  grid: Container[] = [];
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

    const mask = new Sprite(Texture.WHITE);
    mask.width = width;
    mask.height = height;
    this._mask = mask;

    this.positionUpdate();
  }
  abstract cloneTarget(): T;
  get tilePosition() {
    return this._tilePosition;
  }
  set tilePosition(point: PointData) {
    this._tilePosition.copyFrom(point);
    this.positionUpdate();
  }
  setSize(width: number, height: number) {
    this._mask.width = width;
    this._mask.height = height;
    this.positionUpdate();
  }
  positionUpdate() {
    if (this.destroyed) {
      return;
    }
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
        Math.ceil(
          (this._mask.width + Math.abs(basePoint.x)) / this._distence.x,
        ) + 1;
    }

    // vertical and both
    if (this.mode !== TileMode.Horizontal) {
      let y = this._tilePosition.y % this._distence.y;
      if (y > 0) {
        y -= this._distence.y;
      }
      basePoint.y = y;
      tileCountY =
        Math.ceil(
          (this._mask.height + Math.abs(basePoint.y)) / this._distence.y,
        ) + 1;
    }

    let index = 0;
    for (let i = 0; i < tileCountX; i++) {
      for (let j = 0; j < tileCountY; j++) {
        // ensure the children
        let child = this.grid[index];
        if (child === undefined) {
          child = this.cloneTarget();
          this.grid.push(child);
          this.addChild(child);
        }
        child.position.set(
          basePoint.x + i * this._distence.x,
          basePoint.y + j * this._distence.y,
        );

        index += 1;
      }
    }
    //
    if (this.children.length > index) {
      this.removeChildren(index);
    }
  }
  destroy(options: DestroyOptions) {
    super.destroy(options);
    for (const child of this.grid) {
      child.destroy(options);
    }
  }
}

export class GapTilingContainer extends GapTilingBase<CloneableContainer> {
  cloneTarget() {
    return this.target.clone();
  }
}
export class GapTilingAnimatedSprite extends GapTilingBase<AnimatedSprite> {
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
    sprite.scale.copyFrom(this.target.scale);
    sprite.play();
    return sprite;
  }
}

export class GapTilingSprite extends GapTilingBase<Sprite> {
  cloneTarget() {
    const sprite = Sprite.from(this.target.texture);
    sprite.scale.copyFrom(this.target.scale);
    return sprite;
  }
}
