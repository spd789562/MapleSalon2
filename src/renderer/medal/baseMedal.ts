import { Container, Text } from 'pixi.js';

import { CharacterLoader } from '../character/loader';
import type { WzAnimatedMedalData, WzMedal, WzMedalData } from './wz';
import type { WzItem } from '../character/const/wz';

import { MedalStaticBackground } from './medalStaticBackground';
import { MedalAnimatedBackground } from './medalAnimatedBackground';

import { getWzClrColor } from '@/utils/wzUtil';

enum MedalType {
  Medal = 'medal',
  NickTag = 'nickTag',
}

export enum MedalPosition {
  V1 = 'v1',
  V2 = 'v2',
}

export class BaseMedal extends Container {
  id: number;
  _name: string;
  textColor = 0x000000;
  textNode: Text;
  itemWz: WzItem | null = null;
  medalWz: WzMedal | null = null;
  background?: MedalStaticBackground;
  animation?: MedalAnimatedBackground;
  type: MedalType;
  medalPosition: MedalPosition;
  constructor(
    name: string,
    id: number,
    medalType: 'medal' | 'nickTag' = 'medal',
    position = MedalPosition.V2,
  ) {
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
    this.type = medalType as MedalType;
    this.medalPosition = position;
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
    if (this.type === MedalType.Medal) {
      await this.loadMedalWz();
    } else {
      await this.loadNickTagWz();
    }
    if (!(this.itemWz && this.medalWz)) {
      return;
    }
    return true;
  }
  async loadMedalWz() {
    if (this.itemWz?.info?.medalTag) {
      const tagId = this.itemWz.info.medalTag as number;
      this.medalWz = await CharacterLoader.getMedalWz(tagId);
    }
  }
  async loadNickTagWz() {
    if (this.itemWz?.info?.nickTag) {
      const tagId = this.itemWz.info.nickTag as number;
      this.medalWz = await CharacterLoader.getNickTagWz(tagId);
    }
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
  private applyPositionV1() {
    if (this.background && this.type === MedalType.NickTag) {
      this.background.pivot.y = this.background.topOffset;
    }
    if (this.animation && this.background) {
      this.animation.pivot.y = this.background.center.pivot.y;
      this.animation.pivot.x = this.background.pivot.x;
    }
  }
  private applyPositionV2() {
    if (this.background && this.type === MedalType.NickTag) {
      this.background.pivot.y = 0;
    }
    if (this.animation && this.background) {
      this.animation.pivot.y = this.background.center.pivot.y;
      this.animation.pivot.x = this.background.pivot.x;
    }
  }
  applyPosition() {
    if (this.medalPosition === MedalPosition.V1) {
      this.applyPositionV1();
    } else if (this.medalPosition === MedalPosition.V2) {
      this.applyPositionV2();
    }
  }
  renderMedal() {
    if (this.background) {
      this.background.renderBackground();
    }
    if (this.animation) {
      this.animation.renderBackground();
    }
    this.applyPosition();
    this.textNode.pivot.x = this.textNode.width / 2;
    this.textNode.style.fill = this.textColor;
    if (this.background?.isEmptyCenter) {
      this.textNode.visible = false;
    } else {
      this.textNode.visible = true;
    }
    this.pivot.y = -(this.background?.topOffset || 0);
  }
}
