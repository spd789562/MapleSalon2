import { Container, Ticker, type DestroyOptions } from 'pixi.js';

import type { WzMapParticleInfo } from './const/wz';

type ParticleInfoData = Record<string, Record<string, WzMapParticleInfo>>;

import type { MapleMap } from './map';
import { ParticleEmitter } from '../particle/particleEmitter';
import { MapParticle } from './mapParticle';

export class MapParticleSet extends Container {
  map: MapleMap;
  emitterMap: Map<string, ParticleEmitter> = new Map();
  wz: ParticleInfoData;
  particles: MapParticle[] = [];
  constructor(wz: ParticleInfoData, map: MapleMap) {
    super();
    this.map = map;
    this.wz = wz;
  }
  get tags() {
    return this.particles
      .map((obj) => obj.info.tags)
      .filter(Boolean) as string[];
  }
  get backTags() {
    return this.particles
      .map((obj) => obj.info.backTags)
      .filter(Boolean) as string[];
  }
  async load() {
    const particleNames = Object.keys(this.wz);
    const particlePairs = await Promise.all(
      particleNames.map(
        async (particleName) =>
          [
            particleName,
            await ParticleEmitter.createFromWz(particleName),
          ] as const,
      ),
    );
    for (const [particleName, emitter] of particlePairs) {
      this.emitterMap.set(particleName, emitter);
    }
    for (const particleName of particleNames) {
      const particleInfos = this.wz[particleName];
      for (const info of Object.values(particleInfos)) {
        const emitter = this.emitterMap.get(particleName);
        if (!emitter) {
          continue;
        }
        const particle = new MapParticle(info, emitter.clone(), this);
        this.particles.push(particle);
        this.addChild(particle);
      }
    }
    this.bindEvents();
  }
  bindEvents() {
    Ticker.shared.add(this.emitterTicker);
  }
  emitterTicker = (delta: Ticker) => {
    for (const particle of this.particles) {
      particle.emitter.update(delta);
    }
  };
  toggleVisibilityByTags(disableTags: string[], back = false) {
    for (const particle of this.particles) {
      if (back && particle.info.backTags) {
        particle.visible = !disableTags.includes(particle.info.backTags);
      }
      if (!back && particle.info.tags) {
        particle.visible = !disableTags.includes(particle.info.tags);
      }
    }
  }
  destroy(options?: DestroyOptions) {
    super.destroy(options);
    Ticker.shared.remove(this.emitterTicker);
    for (const particle of this.particles) {
      particle.destroy(options);
    }
  }
}
