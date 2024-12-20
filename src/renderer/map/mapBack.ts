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
  Point,
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
function getExtraFlowMode(type?: number) {
  switch (type) {
    case 4:
    case 6:
      return TileMode.Horizontal;
    case 5:
    case 7:
      return TileMode.Vertical;
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
  flowMode: TileMode;
  gapType = BackGapType.Zero;
  gap = { x: 0, y: 0 };
  flowSpeed = { x: 0, y: 0 };
  flowPosition = new Point();
  movePosition = new Point();
  basePosition = new Point();
  targetSize = { width: 0, height: 0 };
  fliped = false;
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
    this.zIndex = index;
    this.fliped = info.f === 1;
    this.mode = getTilingMode(info.type);
    this.flowMode = getExtraFlowMode(info.type);
    this.flowSpeed.x =
      info.flowX ??
      0 + (this.flowMode === TileMode.Horizontal ? (info.rx ?? 0) : 0);
    this.flowSpeed.y =
      info.flowY ??
      0 + (this.flowMode === TileMode.Vertical ? (info.ry ?? 0) : 0);
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
      renderObj.scale.x = this.fliped ? -1 : 1;
      this.targetSize.width = renderObj.width;
      this.targetSize.height = renderObj.height;
      return renderObj;
    }
    if (this.skeletonData) {
      const spine = new Spine(this.skeletonData);
      if (this.info.spineAni) {
        spine.state.setAnimation(0, this.info.spineAni, true);
      }
      if (
        this.info.spineName &&
        spine.skeleton.data.findSkin(this.info.spineName)
      ) {
        spine.skeleton.setSkinByName(this.info.spineName);
      }
      spine.scale.x = this.fliped ? -1 : 1;
      const clone = new CloneableSpine(this.skeletonData, spine);
      return clone;
    }
    const sprite = new AnimatedSprite(
      this.frames.map((frame) => ({
        texture: Assets.get(frame[0]),
        time: frame[1],
      })),
    );
    sprite.scale.x = this.fliped ? -1 : 1;
    const origins = this.frames.map((_, i) => ({
      x: this.wz[i]?.origin?.x || 0,
      y: this.wz[i]?.origin?.y || 0,
    }));
    /* @ts-ignore */
    sprite._origins = origins;
    sprite.onFrameChange = (frame) => {
      sprite.pivot.copyFrom(origins[frame] ?? { x: 0, y: 0 });
    };
    sprite.onFrameChange(0);
    sprite.play();
    return sprite;
  }
  private prepareNonTiledResource() {
    this.renderObj = this.getRenderObj();
    this.position.set(this.info.x ?? 0, this.info.y ?? 0);
    this.targetSize.width = this.renderObj.width;
    this.targetSize.height = this.renderObj.height;
    this.addChild(this.renderObj);
  }
  private prepareTiledResource(renderer: Renderer) {
    const viewport = this.set.map.viewport;
    const target = this.getRenderObj();
    this.targetSize.width = target.width;
    this.targetSize.height = target.height;
    this.gap.x = (this.info.cx ?? 0) > 0 ? this.info.cx - target.width : 0;
    this.info.cx = this.targetSize.width + this.gap.x;
    this.gap.y = (this.info.cy ?? 0) > 0 ? this.info.cy - target.height : 0;
    this.info.cy = this.targetSize.height + this.gap.y;
    this.gapType = getGapType(this.gap.x, this.gap.y);
    this.size.width =
      this.mode !== TileMode.Vertical
        ? viewport.screenWidthInWorldPixels
        : target.width;
    this.size.height =
      this.mode !== TileMode.Horizontal
        ? viewport.screenHeightInWorldPixels
        : target.height;
    this.position.x =
      this.mode !== TileMode.Vertical
        ? viewport.center.x - viewport.screenWidthInWorldPixels / 2
        : (this.info.x ?? 0);
    this.position.y =
      this.mode !== TileMode.Horizontal
        ? viewport.center.y - viewport.screenHeightInWorldPixels / 2
        : (this.info.y ?? 0);
    if (this.mode === TileMode.None) {
      // it should unreachable
      return;
    }
    const isStatic = this.frames.length < 2 && !this.skeletonData;
    // static and tileing
    if (this.gapType === BackGapType.Zero && isStatic) {
      this.putZeroGapTiling(target as Sprite, renderer);
      // static and tiling with gap
    } else if (this.gapType === BackGapType.Positive && isStatic) {
      this.putPositiveGapTiling(target as Sprite, renderer);
    } else {
      this.putExpensiveGapTiling(target);
    }

    const renderObj = this.renderObj as TilingSprite | GapTilingSprite;
    // setting the initial position
    if (this.mode === TileMode.Horizontal || this.mode === TileMode.Both) {
      this.basePosition.x = this.info.x - target.pivot.x;
    } else if (this.info.ani !== 1) {
      // animation has it own pivot
      renderObj.pivot.x = target.pivot.x;
    }
    if (this.mode === TileMode.Vertical || this.mode === TileMode.Both) {
      this.basePosition.y = this.info.y - target.pivot.y;
    } else if (this.info.ani !== 1) {
      renderObj.pivot.y = target.pivot.y;
    }
  }
  prepareResource(renderer: Renderer) {
    if (this.mode === TileMode.None) {
      this.prepareNonTiledResource();
    } else {
      this.prepareTiledResource(renderer);
    }
    this.parallaxTicker();
    this.bindParallaxEvent();
  }
  putZeroGapTiling(originSprite: Sprite, renderer: Renderer) {
    let _texture = originSprite.texture;
    if (this.fliped) {
      const flipTexture = renderer.generateTexture(originSprite);
      _texture = flipTexture;
    }

    this.renderObj = new TilingSprite({
      texture: _texture,
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
    this.addChild(this.renderObj);
  }
  moveTicker = () => {
    if (this.destroyed || !this.renderObj) {
      return;
    }
    const tilingSprite = this.renderObj as
      | TilingSprite
      | GapTilingSprite
      | GapTilingAnimatedSprite;
    this.flowPosition.x += (this.flowSpeed.x * 5) / 60;
    this.flowPosition.x %= this.info.cx;
    this.flowPosition.y += (this.flowSpeed.y * 5) / 60;
    this.flowPosition.y %= this.info.cy;
    tilingSprite.tilePosition = {
      x: this.movePosition.x + this.flowPosition.x + this.basePosition.x,
      y: this.movePosition.y + this.flowPosition.y + this.basePosition.y,
    };
  };
  parallaxTicker = () => {
    if (this.destroyed || !this.renderObj) {
      return;
    }
    const viewport = this.set.map.viewport;
    const center = viewport.center;
    const xInc = (center.x * ((this.info.rx ?? 0) + 100)) / 100;
    const yInc = (center.y * ((this.info.ry ?? 0) + 100)) / 100;
    // directly move pos x
    if (this.mode === TileMode.None || this.mode === TileMode.Vertical) {
      this.position.x = this.info.x + xInc;
    }
    // directly move pos y
    if (this.mode === TileMode.None || this.mode === TileMode.Horizontal) {
      this.position.y = this.info.y + yInc;
    }
    if (this.mode === TileMode.None) {
      return;
    }
    const tilingSprite = this.renderObj as
      | TilingSprite
      | GapTilingSprite
      | GapTilingContainer
      | GapTilingAnimatedSprite;
    const originWidth = this.size.width;
    const originHeight = this.size.height;
    this.updateViewportData();
    if (originWidth !== this.size.width || originHeight !== this.size.height) {
      tilingSprite.setSize(this.size.width, this.size.height);
    }
    if (this.mode === TileMode.Both || this.mode === TileMode.Horizontal) {
      this.movePosition.x += xInc;
    }
    if (this.mode === TileMode.Both || this.mode === TileMode.Vertical) {
      this.movePosition.y += yInc;
    }
    tilingSprite.tilePosition = {
      x: this.basePosition.x + this.flowPosition.x + this.movePosition.x,
      y: this.basePosition.y + this.flowPosition.y + this.movePosition.y,
    };
  };
  updateViewportData() {
    const viewport = this.set.map.viewport;
    const screenWidth = viewport.screenWidthInWorldPixels;
    const screenHeight = viewport.screenHeightInWorldPixels;
    const x = viewport.center.x - screenWidth / 2;
    const y = viewport.center.y - screenHeight / 2;
    if (this.mode === TileMode.Both || this.mode === TileMode.Horizontal) {
      this.size.width = screenWidth;
      this.position.x = x;
      this.movePosition.x = -x;
    }
    if (this.mode === TileMode.Both || this.mode === TileMode.Vertical) {
      this.size.height = screenHeight;
      this.position.y = y;
      this.movePosition.y = -y;
    }
  }
  bindParallaxEvent() {
    const needMoving = this.flowSpeed.x !== 0 || this.flowSpeed.y !== 0;
    if (needMoving) {
      Ticker.shared.add(this.moveTicker);
    }
    const viewport = this.set.map.viewport;
    Ticker.shared.add(this.parallaxTicker);
    viewport.on('moved', this.parallaxTicker);
    viewport.on('zoomed', this.parallaxTicker);
  }
  removeParallaxEvent() {
    const viewport = this.set.map.viewport;
    viewport.off('moved', this.parallaxTicker);
    viewport.off('zoomed', this.parallaxTicker);
    Ticker.shared.remove(this.parallaxTicker);
    Ticker.shared.remove(this.moveTicker);
  }
  destroy(options?: DestroyOptions): void {
    super.destroy(options);
    this.removeParallaxEvent();
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
    spine.scale.copyFrom(this.spine.scale);
    return clone;
  }
}
