import { Container, Text } from 'pixi.js';

import { CharacterLoader } from '../character/loader';
import type { WzNickTag, WzNickTagData } from './wz';
import type { WzItem } from '../character/const/wz';

import { NickTagBackground } from './nickTagBackground';

import { getWzClrColor } from '@/utils/wzUtil';

export class NickTag extends Container {
  id: number;
  _name: string;
  textColor = 0x000000;
  textNode: Text;
  itemWz: WzItem | null = null;
  medalWz: WzNickTag | null = null;
  background?: NickTagBackground;
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
  async loadWz() {
    const id = this.id as number;
    this.itemWz = await CharacterLoader.getPieceWz(id);
    if (this.itemWz?.info?.nickTag) {
      const tagId = this.itemWz.info.nickTag as number;
      this.medalWz = await CharacterLoader.getNickTagWz(tagId);
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
    const background = new NickTagBackground(
      this.medalWz as WzNickTagData,
      this.textNode.width,
    );
    this.background = background;
    this.addChild(background);

    this.textColor = getWzClrColor(this.medalWz.clr);

    return this.background.prepareResource();
  }
  async load() {
    const result = await this.loadWz();
    if (!result) {
      return;
    }
    await this.updateBackground();
    this.renderNickTag();
  }
  renderNickTag() {
    if (this.background) {
      this.background.renderBackground();
    }
    this.textNode.pivot.x = this.textNode.width / 2;
    this.textNode.style.fill = this.textColor;
    this.pivot.y = -(this.background?.topOffset || 0);
  }
}
