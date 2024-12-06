import {
  AnimatedSprite,
  TilingSprite,
  Sprite,
  Assets,
  Container,
  Ticker,
  type UnresolvedAsset,
  type Renderer,
  Rectangle,
  type DestroyOptions,
} from 'pixi.js';
import { type SkeletonData, Spine } from '@esotericsoftware/spine-pixi-v8';

import type { WzMapBackInfo, WzPngPieceInfo } from './const/wz';
import { CharacterLoader } from '../character/loader';
import type { MapBackSet } from './mapBackSet';
import {
  type CloneableContainer,
  GapTilingAnimatedSprite,
  GapTilingContainer,
  GapTilingSprite,
  TileMode,
} from '../container/GapTilingContainer';

enum BackGapType {
  Zero = 0,
  Positive = 1,
  Negative = 2,
}

function getGapType(x?: number, y?: number) {
  const _x = x ?? 0;
  const _y = y ?? 0;
  if (_x === 0 && _y === 0) {
    return BackGapType.Zero;
  }
  if (_x < 0 || _y < 0) {
    return BackGapType.Negative;
  }
  return BackGapType.Positive;
}

function getTilingMode(type?: number) {
  switch (type) {
    case 1:
    case 4:
      return TileMode.Horizontal;
    case 2:
    case 5:
      return TileMode.Vertical;
    case 3:
    case 6:
    case 7:
      return TileMode.Both;
    default:
      return TileMode.None;
  }
}

export class MapBack extends Container {
  info: WzMapBackInfo;
  wz: Record<number, WzPngPieceInfo>;
  frames: [string, number][] = [];
  renderObj:
    | TilingSprite
    | GapTilingSprite
    | GapTilingContainer
    | GapTilingAnimatedSprite
    | Sprite
    | AnimatedSprite
    | CloneableSpine
    | null = null;
  mode: TileMode;
  gapType = BackGapType.Zero;
  gap = { x: 0, y: 0 };
  flowSpeed = { x: 0, y: 0 };
  size = { width: 800, height: 600 };
  set: MapBackSet;
  skeletonData?: SkeletonData;
  constructor(
    info: WzMapBackInfo,
    wz: Record<number, WzPngPieceInfo>,
    index: number,
    set: MapBackSet,
  ) {
    super();
    this.info = info;
    this.wz = wz;
    this.set = set;
    const numberKeys = Object.keys(wz).map(Number).filter(Number.isInteger);
    numberKeys.sort((a, b) => a - b);
    for (const key of numberKeys) {
      const obj = wz[key] as unknown as WzPngPieceInfo;
      if (!obj) {
        continue;
      }
      this.frames.push([obj._outlink || obj.path || '', obj.delay || 100]);
    }
    this.position.set(info.x ?? 0, info.y ?? 0);
    this.zIndex = index;
    this.scale.x = info.f === 1 ? -1 : 1;
    this.mode = getTilingMode(info.type);
    this.flowSpeed.x = info.flowX ?? 0;
    this.flowSpeed.y = info.flowY ?? 0;
    this.alpha = (info.a ?? 255) / 255;
  }
  get resources() {
    return this.frames.map((frame) => {
      return {
        alias: frame[0],
        src: CharacterLoader.getPieceUrl(frame[0]),
        loadParser: 'loadTextures',
        format: '.webp',
      } as UnresolvedAsset;
    });
  }
  private getRenderObj(): Sprite | AnimatedSprite | CloneableSpine {
    if (this.frames.length < 2 && !this.skeletonData) {
      const renderObj = Sprite.from(this.frames[0][0]);
      renderObj.pivot.set(
        this.wz[0]?.origin?.x || 0,
        this.wz[0]?.origin?.y || 0,
      );
      return renderObj;
    }
    if (this.skeletonData) {
      const spine = new Spine(this.skeletonData);
      // spine.pivot.set(this.wz[0]?.origin?.x || 0, this.wz[0]?.origin?.y || 0);
      if (this.info.spineAni) {
        spine.state.setAnimation(0, this.info.spineAni, true);
      }
      const clone = new CloneableSpine(this.skeletonData, spine);
      return clone;
    }
    const sprite = new AnimatedSprite(
      this.frames.map((frame) => ({
        texture: Assets.get(frame[0]),
        time: frame[1],
      })),
    );
    sprite.onFrameChange = (frame) => {
      sprite.pivot.set(
        this.wz[frame]?.origin?.x || 0,
        this.wz[frame]?.origin?.y || 0,
      );
    };
    sprite.onFrameChange(0);
    sprite.play();
    return sprite;
  }
  private prepareNonTiledResource() {
    this.renderObj = this.getRenderObj();
    this.position.x = this.info.x ?? 0;
    this.position.y = this.info.y ?? 0;
    this.addChild(this.renderObj);
  }
  private prepareTiledResource(
    worldSize: { width: number; height: number },
    renderer: Renderer,
  ) {
    const target = this.getRenderObj();
    console.log('target', target, this.info.cx, target.width);
    this.gap.x =
      (this.info.cx ?? 0) > 0 || this.info.cx % target.width !== 0
        ? this.info.cx - target.width
        : 0;
    this.gap.y =
      (this.info.cy ?? 0) > 0 || this.info.cy % target.height !== 0
        ? this.info.cy - target.height
        : 0;
    this.gapType = getGapType(this.gap.x, this.gap.y);
    this.size.width =
      this.mode !== TileMode.Vertical ? worldSize.width : target.width;
    this.size.height =
      this.mode !== TileMode.Horizontal ? worldSize.height : target.height;
    this.position.x =
      this.mode !== TileMode.Vertical
        ? this.set.map.edges.left
        : (this.info.x ?? 0);
    this.position.y =
      this.mode !== TileMode.Horizontal
        ? this.set.map.edges.top
        : (this.info.y ?? 0);
    if (this.mode === TileMode.None) {
      // it should unreachable
      return;
    }
    const isStatic = this.frames.length < 2 && !this.skeletonData;
    // static and tileing
    if (this.gapType === BackGapType.Zero && isStatic) {
      this.putZeroGapTiling(target as Sprite);
      // static and tiling with gap
    } else if (this.gapType === BackGapType.Positive && isStatic) {
      this.putPositiveGapTiling(target as Sprite, renderer);
    } else {
      this.putExpensiveGapTiling(target);
    }
    const needMoving = !!this.info.flowX || !!this.info.flowY;
    if (needMoving) {
      Ticker.shared.add(this.moveTicker);
    }
  }
  prepareResource(
    worldSize: { width: number; height: number },
    renderer: Renderer,
  ) {
    if (this.mode === TileMode.None) {
      this.prepareNonTiledResource();
    } else {
      this.prepareTiledResource(worldSize, renderer);
    }
  }
  putZeroGapTiling(originSprite: Sprite) {
    this.renderObj = new TilingSprite({
      texture: originSprite.texture,
      width: this.size.width,
      height: this.size.height,
    });
    this.addChild(this.renderObj);
  }
  putPositiveGapTiling(originSprite: Sprite, renderer: Renderer) {
    const _spacedTexture = new Container();
    _spacedTexture.addChild(originSprite);
    const spacedTexture = renderer.generateTexture({
      target: _spacedTexture,
      frame: new Rectangle(
        -originSprite.pivot.x,
        -originSprite.pivot.y,
        originSprite.width + this.gap.x,
        originSprite.height + this.gap.y,
      ),
    });
    _spacedTexture.destroy();
    this.renderObj = new TilingSprite({
      texture: spacedTexture,
      width: this.size.width,
      height: this.size.height,
    });
    this.renderObj.pivot.x =
      this.mode !== TileMode.Vertical ? 0 : originSprite.pivot.x;
    this.renderObj.pivot.y =
      this.mode !== TileMode.Horizontal ? 0 : originSprite.pivot.y;
    this.addChild(this.renderObj);
  }
  putExpensiveGapTiling(
    originSprite: Sprite | AnimatedSprite | CloneableSpine,
  ) {
    if (this.frames.length < 2 && !this.skeletonData) {
      this.renderObj = new GapTilingSprite({
        target: originSprite as Sprite,
        size: this.size,
        gap: this.gap,
        mode: this.mode,
      });
    } else if (this.skeletonData) {
      this.renderObj = new GapTilingContainer({
        target: originSprite as CloneableSpine,
        size: this.size,
        gap: this.gap,
        mode: this.mode,
      });
    } else {
      this.renderObj = new GapTilingAnimatedSprite({
        target: originSprite as AnimatedSprite,
        size: this.size,
        gap: this.gap,
        mode: this.mode,
      });
    }
    this.renderObj.pivot.x =
      this.mode !== TileMode.Vertical ? 0 : originSprite.pivot.x;
    this.renderObj.pivot.y =
      this.mode !== TileMode.Horizontal ? 0 : originSprite.pivot.y;
    this.addChild(this.renderObj);
  }
  moveTicker = (delta: Ticker) => {
    if (this.destroyed || !this.renderObj) {
      return;
    }
    const tilingSprite = this.renderObj as
      | TilingSprite
      | GapTilingSprite
      | GapTilingAnimatedSprite;
    tilingSprite.tilePosition = {
      x: tilingSprite.tilePosition.x + (this.flowSpeed.x * 5) / 60,
      y: tilingSprite.tilePosition.y + (this.flowSpeed.y * 5) / 60,
    };
  };
  destroy(options?: DestroyOptions): void {
    super.destroy(options);
    Ticker.shared.remove(this.moveTicker);
  }
}

export class CloneableSpine extends Container implements CloneableContainer {
  skeletonData: SkeletonData;
  spine: Spine;
  constructor(skeletonData: SkeletonData, spine: Spine) {
    super();
    this.skeletonData = skeletonData;
    this.spine = spine;
    this.addChild(spine);
  }
  clone() {
    const spine = new Spine(this.skeletonData);
    const clone = new CloneableSpine(this.skeletonData, spine);
    const currentAnimateion = this.spine.state.getCurrent(0);
    if (currentAnimateion?.animation?.name) {
      spine.state.setAnimation(0, currentAnimateion.animation.name, true);
    }
    spine.pivot.copyFrom(this.spine.pivot);
    spine.position.copyFrom(this.spine.position);
    return clone;
  }
}
