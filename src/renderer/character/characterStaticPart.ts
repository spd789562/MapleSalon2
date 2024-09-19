import { Assets, Container, type UnresolvedAsset } from 'pixi.js';
import type { CharacterItemPiece } from './itemPiece';
import type { CharacterItem } from './item';

export class CharacterStaticPart extends Container {
  item: CharacterItem;
  frameData: CharacterItemPiece;
  frame: number;

  constructor(
    item: CharacterItem,
    frameData: CharacterItemPiece,
    frame: number,
  ) {
    super();
    this.frame = frame;
    this.frameData = frameData;
    this.item = item;
    this.filters = item.filters;
    this.addChild(frameData.getRenderAble());
    this.position.copyFrom(frameData.position);
  }

  get isAncherBuilt() {
    return this.frameData.isAncherBuilt;
  }
  get isEmpty() {
    return this.frameData.zIndex === -1;
  }

  get resources() {
    return this.frameData.getResource() || ([] as UnresolvedAsset[]);
  }

  async prepareResource() {
    await Assets.load(this.resources);
  }

  updateFrameData(frame: CharacterItemPiece) {
    this.frameData = frame;
    this.removeChildren();
    this.addChild(frame.getRenderAble());
    this.position.copyFrom(frame.position);
  }
  updateAncher() {
    this.position.copyFrom(this.frameData.position);
  }

  clone() {
    return new CharacterStaticPart(this.item, this.frameData, this.frame);
  }
}
