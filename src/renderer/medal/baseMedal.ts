import { Container, Text } from 'pixi.js';

import { CharacterLoader } from '../character/loader';
import type { WzAnimatedMedalData, WzMedal, WzMedalData } from './wz';
import type { WzItem } from '../character/const/wz';

import { MedalStaticBackground } from './medalStaticBackground';
import { MedalAnimatedBackground } from './medalAnimatedBackground';

import { getWzClrColor } from '@/utils/wzUtil';

export class BaseMedal extends Container {
  id: number;
  _name: string;
  textColor = 0x000000;
  textNode: Text;
  itemWz: WzItem | null = null;
  medalWz: WzMedal | null = null;
  background?: MedalStaticBackground;
  animation?: MedalAnimatedBackground;
  constructor(name: string, id: number) {
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
    this.textNode.zIndex = 10;
    this.addChild(this.textNode);
  }
  get isAnimated() {
    return !!this.medalWz && 'ani' in this.medalWz;
  }

  play() {
    this.animation?.play();
  }
  stop() {
    this.animation?.stop();
  }
  async loadWz() {
    const id = this.id as number;
    this.itemWz = await CharacterLoader.getPieceWz(id);
    if (this.itemWz?.info?.medalTag) {
      const tagId = this.itemWz.info.medalTag as number;
      this.medalWz = await CharacterLoader.getMedalWz(tagId);
    }
    if (!(this.itemWz && this.medalWz)) {
      return;
    }
    return true;
  }
  updateBackground() {
    if (!this.medalWz) {
      return;
    }
    const background = new MedalStaticBackground(
      this.medalWz as WzMedalData,
      this.textNode.width,
    );
    this.background = background;
    this.addChild(background);
    const resource = [this.background.prepareResource()];

    if (this.isAnimated) {
      const animation = new MedalAnimatedBackground(
        this.medalWz as WzAnimatedMedalData,
      );
      this.animation = animation;
      animation.zIndex = 11;
      this.addChild(animation);
      resource.push(animation.prepareResource());
    }
    this.textColor = getWzClrColor(this.medalWz.clr);

    return Promise.all(resource);
  }
  async load() {
    const result = await this.loadWz();
    if (!result) {
      return;
    }
    await this.updateBackground();
    this.renderMedal();
  }
  renderMedal() {
    if (this.background) {
      this.background.renderBackground();
    }
    if (this.animation) {
      this.animation.renderBackground();
    }
    this.textNode.pivot.x = this.textNode.width / 2;
    this.textNode.style.fill = this.textColor;
    if (this.animation && this.background) {
      this.animation.position.y = -this.background.center.pivot.y;
      this.animation.position.x = -this.background.pivot.x;
    }
    this.pivot.y = -(this.background?.topOffset || 0);
  }
}
