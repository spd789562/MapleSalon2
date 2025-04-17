import { Container, Text } from 'pixi.js';

import { CharacterLoader } from '../character/loader';
import type { WzNameTag } from './wz';
import type { WzItem } from '../character/const/wz';

import { NameTagStaticBackground } from './nameTagStaticBackground';
import { NameTagAnimatedBackground } from './nameTagAnimatedBackground';
import { NameTagColorBackground } from './nameTagColorBackground';

import { getWzClrColor } from '@/utils/wzUtil';

enum NameTagPosition {
  V1 = 'v1',
  V2 = 'v2',
}

/* TODO: fix position, it currently some name tag will too high */
export class BaseNameTag extends Container {
  id?: number;
  _name: string;
  textColor = 0x000000;
  textNode: Text;
  itemWz: WzItem | null = null;
  tagWz: WzNameTag | null = null;
  background?:
    | NameTagStaticBackground
    | NameTagAnimatedBackground
    | NameTagColorBackground;
  nameTagPosition: NameTagPosition;
  constructor(name: string, id?: number, position = NameTagPosition.V2) {
    super();
    this.sortableChildren = true;
    this._name = name;
    this.id = id;
    this.textNode = new Text({
      text: name,
      style: {
        fill: this.textColor,
        fontSize: 12,
        fontFamily: 'SimSun, MingLiU, sans-serif',
        align: 'center',
      },
    });
    this.nameTagPosition = position;
    this.textNode.zIndex = 10;
    this.addChild(this.textNode);
  }
  get name() {
    return this._name;
  }
  set name(name: string) {
    this._name = name;
    this.textNode.text = name;
  }
  get isAnimated() {
    return (
      !!this.tagWz &&
      ('wz2_aniNameTag' in this.tagWz ||
        'aniNameTag' in this.tagWz ||
        this.isAnimatedLike)
    );
  }
  get isAnimatedLike() {
    return !!this.tagWz && [0, 1, 2].every((key) => key in this.tagWz!);
  }
  isAnimatedBackground(
    background?:
      | NameTagStaticBackground
      | NameTagAnimatedBackground
      | NameTagColorBackground,
  ): background is NameTagAnimatedBackground {
    return this.isAnimated && background?.type === 'animated';
  }

  play() {
    if (this.isAnimatedBackground(this.background)) {
      this.background.play();
    }
  }
  stop() {
    if (this.isAnimatedBackground(this.background)) {
      this.background.stop();
    }
  }
  async loadWz() {
    const id = this.id as number;
    this.itemWz = await CharacterLoader.getPieceWz(id);
    if (this.itemWz?.info?.nameTag) {
      const tagId = this.itemWz.info.nameTag as number;
      this.tagWz = await CharacterLoader.getNameTagWz(tagId);
    }
    if (!(this.itemWz && this.tagWz)) {
      return;
    }
    return true;
  }
  updateBackground() {
    if (!this.tagWz) {
      return;
    }
    const prevBackground = this.background;
    const background = this.isAnimated
      ? new NameTagAnimatedBackground()
      : new NameTagStaticBackground();

    if (prevBackground?.type !== background.type) {
      prevBackground && this.removeChild(prevBackground);
      this.addChild(background);
      this.background = background;
    }

    if (!this.background) {
      return;
    }
    /* @ts-ignore */
    this.background.updatePiece(this.tagWz);

    this.textColor = getWzClrColor(this.tagWz.clr);

    return this.background.prepareResource();
  }
  async load() {
    if (this.id) {
      const result = await this.loadWz();
      result && (await this.updateBackground());
    }
  }
  async updateNameTagData(
    name: string,
    id?: number,
    position?: NameTagPosition,
  ) {
    this.name = name;
    if (position) {
      this.nameTagPosition = position;
    }
    if (id && id !== this.id) {
      this.id = id;
      await this.load();
    } else if (!id) {
      this.id = undefined;
      this.background && this.removeChild(this.background);
      this.background = new NameTagColorBackground();
      this.addChild(this.background);
      this.textColor = 0xffffff;
    }
    if (!this.destroyed) {
      this.renderNameTag();
    }
  }
  private applyV1Position() {
    this.textNode.pivot.y = -1;
    if (this.background && this.background.type !== 'color') {
      this.textNode.pivot.x = this.background.pivot.x;
    }
  }
  private applyV2Position() {
    this.textNode.pivot.set(this.textNode.width / 2, 0);
  }
  applyPosition() {
    if (this.nameTagPosition === NameTagPosition.V1) {
      this.applyV1Position();
    } else if (this.nameTagPosition === NameTagPosition.V2) {
      this.applyV2Position();
    }
  }
  renderNameTag() {
    this.textNode.pivot.x = this.textNode.width / 2;
    if (this.background) {
      this.background.nameWidth = this.textNode.width;
      this.background.renderBackground();
    }
    this.applyPosition();
    this.textNode.style.fill = this.textColor;
    this.pivot.y = -(this.background?.topOffset || 0);
  }
}
