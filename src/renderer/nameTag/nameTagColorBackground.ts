import { Container, Graphics } from 'pixi.js';

export class NameTagColorBackground extends Container {
  graphic = new Graphics();
  _nameWidth = 30;
  color = 0x000000;
  type = 'color';
  constructor() {
    super();
    this.addChild(this.graphic);
  }
  updatePiece(_: unknown) {}
  async prepareResource() {}
  renderBackground() {
    this.graphic.clear();
    this.graphic.roundRect(0, 0, this._nameWidth + 6, 17, 3);
    this.graphic.fill({
      color: this.color,
      alpha: 0.6,
    });

    this.pivot.y = 2;
    this.pivot.x = (this._nameWidth + 6) / 2;
  }
  set nameWidth(width: number) {
    this._nameWidth = width;
  }
}
