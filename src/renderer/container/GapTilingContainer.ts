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
  _tilePosition = new Point(0, 0);
  maxXcount: number;
  maxYcount: number;
  constructor(options: {
    target: T;
    size: { width: number; height: number };
    gap: PointData;
    mode: TileMode;
  }) {
    super();
    const { target, size, gap, mode } = options;
    this.target = target;
    const width = mode === TileMode.Vertical ? target.width : size.width;
    const height = mode === TileMode.Horizontal ? target.height : size.height;

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
  get tilePosition() {
    return this._tilePosition;
  }
  set tilePosition(point: PointData) {
    this.positionUpdate({
      x: this._tilePosition.x - point.x,
      y: this._tilePosition.y - point.y,
    });
    this._tilePosition.copyFrom(point);
  }
  positionUpdate({ x, y }: PointData) {
    for (let i = 0; i < this.maxYcount; i++) {
      for (let j = 0; j < this.maxXcount; j++) {
        const target = this.grid[i][j];
        target.position.x += x;
        target.position.y += y;
      }
    }
    for (let i = 0; i < this.maxYcount; i++) {
      for (let j = 0; j < this.maxXcount; j++) {
        const target = this.grid[i][j];
        let isRePosition = false;
        const repositionPoint = {
          x: target.position.x,
          y: target.position.y,
        };
        if (repositionPoint.x < -this._distence.x) {
          const prev = this.grid[i][j === 0 ? this.maxXcount - 1 : j - 1];
          repositionPoint.x = prev.position.x + this._distence.x;
          isRePosition = true;
        } else if (repositionPoint.x > this._mask.width) {
          const next = this.grid[i][j === this.maxXcount - 1 ? 0 : j + 1];
          repositionPoint.x = next.position.x - this._distence.x;
          isRePosition = true;
        }

        if (repositionPoint.y < -this._distence.y) {
          const prev = this.grid[i === 0 ? this.maxYcount - 1 : i - 1][j];
          repositionPoint.y = prev.position.y + this._distence.y;
          isRePosition = true;
        } else if (repositionPoint.y > this._mask.height) {
          const next = this.grid[i === this.maxYcount - 1 ? 0 : i + 1][j];
          repositionPoint.y = next.position.y - this._distence.y;
          isRePosition = true;
        }

        if (isRePosition) {
          target.position.copyFrom(repositionPoint);
          this.removeChild(target);
          this.addChild(target);
        }
      }
    }
  }
}

export class GapTilingContainer extends GapTilingBase<CloneableContainer> {
  initializeTiling() {
    for (let i = 0; i < this.maxYcount; i++) {
      for (let j = 0; j < this.maxXcount; j++) {
        const cloned = this.target.clone();
        cloned.position.set(j * this._distence.x, i * this._distence.y);
        if (this.grid[i] === undefined) {
          this.grid[i] = [];
        }
        this.grid[i].push(cloned);
        this.addChild(cloned);
      }
    }
  }
}
export class GapTilingAnimatedSprite extends GapTilingBase<AnimatedSprite> {
  initializeTiling() {
    for (let i = 0; i < this.maxYcount; i++) {
      for (let j = 0; j < this.maxXcount; j++) {
        const cloned = new AnimatedSprite(this.target.textures);
        cloned.position.set(j * this._distence.x, i * this._distence.y);
        if (this.grid[i] === undefined) {
          this.grid[i] = [];
        }
        this.grid[i].push(cloned);
        this.addChild(cloned);
      }
    }
  }
}

export class GapTilingSprite extends GapTilingBase<Sprite> {
  initializeTiling() {
    for (let i = 0; i < this.maxYcount; i++) {
      for (let j = 0; j < this.maxXcount; j++) {
        const cloned = Sprite.from(this.target.texture);
        cloned.position.set(j * this._distence.x, i * this._distence.y);
        if (this.grid[i] === undefined) {
          this.grid[i] = [];
        }
        this.grid[i].push(cloned);
        this.addChild(cloned);
      }
    }
  }
}
