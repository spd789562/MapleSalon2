import type { Application } from 'pixi.js';
import { Viewport } from 'pixi-viewport';

export interface ZoomContainerOptions {
  width: number;
  height: number;
  worldScale?: number;
  maxScale?: number;
  minScale?: number;
  defaultInteraction?: boolean;
}
export class ZoomContainer extends Viewport {
  worldScale: number;
  hasMap: boolean;
  constructor(app: Application, options: ZoomContainerOptions) {
    const worldScale = options.worldScale || 1;
    const worldWidth = app.screen.width * worldScale;
    const worldHeight = app.screen.height * worldScale;
    super({
      allowPreserveDragOutside: true,
      screenWidth: options.width,
      screenHeight: options.height,
      worldWidth,
      worldHeight,
      events: app.renderer.events,
      disableOnContextMenu: true,
    });
    this.worldScale = worldScale;
    this.hasMap = false;

    this.drag()
      .pinch()
      .wheel()
      .clampZoom({
        maxScale: options.maxScale || 3,
        minScale: options.minScale || 0.5,
      })
      .clamp({
        top: -options.height,
        left: -options.width,
        bottom: options.height,
        right: options.width,
      })
      .moveCenter(0, 0);
    if (options.defaultInteraction !== false) {
      this.enable();
    } else {
      this.disable();
    }
  }
  resizeScreen(width: number, height: number) {
    this.screenWidth = width;
    this.screenHeight = height;
    if (!this.hasMap) {
      console.log('resize', width, height);
      this.worldWidth = width * this.worldScale;
      this.worldHeight = height * this.worldScale;
    }
    console.log(this);
  }
  disable() {
    this.plugins.pause('drag');
    this.plugins.pause('pinch');
    this.plugins.pause('wheel');
  }
  enable() {
    this.plugins.resume('drag');
    this.plugins.resume('pinch');
    this.plugins.resume('wheel');
  }
}
