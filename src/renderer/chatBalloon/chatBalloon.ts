import { Container, Text } from 'pixi.js';

import { CharacterLoader } from '../character/loader';
import type { WzChatBalloon } from './wz';

import { ChatBalloonBackground } from './chatBalloonBackground';

import { getWzClrColor } from '@/utils/wzUtil';

export class ChatBalloon extends Container {
  id?: number;
  _text: string;
  textColor = 0x000000;
  textNode: Text;
  wz: WzChatBalloon | null = null;
  background: ChatBalloonBackground;
  constructor(text: string, id?: number) {
    super();
    this.sortableChildren = true;
    this._text = text;
    this.id = id;
    this.textNode = new Text({
      text: text,
      style: {
        fill: this.textColor,
        fontSize: 12,
        fontFamily: 'SimSun, MingLiU, sans-serif',
        align: 'center',
        lineHeight: 16,
        breakWords: true,
        wordWrap: true,
        wordWrapWidth: 90,
      },
    });
    this.textNode.zIndex = 10;
    this.background = new ChatBalloonBackground();
    this.addChild(this.textNode);
    this.addChild(this.background);
  }
  get chatBalloonId() {
    return this.background.id;
  }
  get text() {
    return this._text;
  }
  set text(text: string) {
    this._text = text;
    this.textNode.text = text;
  }
  async getChatBalloonId(itemId: number) {
    if (!itemId) {
      return 0;
    }
    const itemWz = await CharacterLoader.getPieceWz(itemId);
    return itemWz?.info?.chatBalloon || 0;
  }
  async loadWz() {
    const id = await this.getChatBalloonId(this.id as number);
    this.wz = await CharacterLoader.getChatBalloonWz(id);
    if (!this.wz) {
      return;
    }
    this.background.id = id;
    return true;
  }
  async updateBackground() {
    if (!this.wz) {
      return;
    }
    this.background.updatePiece(this.wz);
    await this.background.prepareResource();

    this.textColor = getWzClrColor(this.wz.clr);
  }
  async load() {
    const result = await this.loadWz();
    result && (await this.updateBackground());
  }
  async updateChatBalloonData(id?: number) {
    if (id && id !== this.id) {
      this.id = id;
      await this.load();
    } else if (!id && (id !== this.id || this.background.assets.length === 0)) {
      this.id = undefined;
      this.textColor = 0x000000;
      await this.load();
    }
    if (!this.destroyed) {
      this.renderChatBalloon();
    }
  }
  updateText(text: string) {
    this.text = text;
    if (this.destroyed || !this.visible) {
      return;
    }
    this.renderChatBalloon();
  }
  renderChatBalloon() {
    this.background.minWidth = this.textNode.width;
    this.background.minHeight = this.textNode.height;
    this.background.renderBackground();
    this.textNode.style.fill = this.textColor;
    this.textNode.position.copyFrom(this.background.topLeftPadding);
    this.pivot.y = this.height;
  }
}
