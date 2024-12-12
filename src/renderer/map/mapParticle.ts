import { Container, type DestroyOptions, Ticker } from 'pixi.js';
import type { WzMapParticleInfo } from './const/wz';
import type { MapParticleSet } from './mapParticleSet';
import type { ParticleEmitter } from '../particle/particleEmitter';

export class MapParticle extends Container {
  set: MapParticleSet;
  emitter: ParticleEmitter;
  info: WzMapParticleInfo;
  constructor(
    wz: WzMapParticleInfo,
    emitter: ParticleEmitter,
    set: MapParticleSet,
  ) {
    super();
    this.info = wz;
    this.emitter = emitter;
    this.set = set;
    this.position.set(wz.x ?? 0, wz.y ?? 0);
    emitter.initialize();
    this.addChild(emitter.container);
    if (wz.rx !== -100 || wz.ry !== -100) {
      this.bindEvents();
    }
  }
  parallaxTicker = () => {
    if (this.destroyed) {
      return;
    }
    const viewport = this.set.map.viewport;
    const center = viewport.center;
    const xInc = (center.x * ((this.info.rx ?? 0) + 100)) / 100;
    const yInc = (center.y * ((this.info.ry ?? 0) + 100)) / 100;
    this.position.x = this.info.x + xInc;
    this.position.y = this.info.y + yInc;
  };
  bindEvents() {
    const viewport = this.set.map.viewport;
    viewport.on('moved', this.parallaxTicker);
    viewport.on('zoomed', this.parallaxTicker);
  }
  destroy(options?: DestroyOptions) {
    super.destroy(options);
    Ticker.shared.remove(this.parallaxTicker);
    this.emitter.destroy();
  }
}
