import {
  Color,
  ParticleContainer,
  Assets,
  type PointData,
  type Texture,
  type ParticleOptions,
  Point,
  type Ticker,
} from 'pixi.js';
import 'pixi.js/math-extras';
import { ParticleBlendFunc, type WzParticleData } from './const/wz';
import { ParticleItem, type ParticleItemOptions } from './particleItem';

import { $apiHost } from '@/store/const';

export class ParticleEmitter {
  particles: ParticleItem[] = [];
  container: ParticleContainer;
  wz: WzParticleData;
  texture: Texture;
  startColor: Color;
  startColorVar: Color;
  endColor: Color;
  endColorVar: Color;
  gravity: Point = new Point(0, 0);
  particalCount = 1;
  emitPersecond = 100;

  radialTmp = new Point(0, 0);
  accDirTmp = new Point(0, 0);
  tangentTmp = new Point(0, 0);

  index = 0;

  constructor(particleData: WzParticleData, texture: Texture) {
    this.wz = particleData;
    this.container = new ParticleContainer();
    this.texture = texture;
    this.startColor = this.createColorFromNumber(particleData.startColor);
    this.startColorVar = this.createColorFromNumber(particleData.startColorVar);
    this.endColor = this.createColorFromNumber(particleData.endColor);
    this.endColorVar = this.createColorFromNumber(particleData.endColorVar);
    if (particleData.duration > 0) {
      this.emitPersecond =
        particleData.totalParticle / Math.min(particleData.duration, 1);
    } else {
      const minLife = Math.max(0, particleData.life - particleData.lifeVar);
      const maxLife = Math.max(0, particleData.life + particleData.lifeVar);
      this.emitPersecond =
        particleData.totalParticle / Math.max((minLife + maxLife) / 2, 1);
    }
    if (particleData.GRAVITY) {
      this.gravity.x = particleData.GRAVITY.x;
      this.gravity.y = particleData.GRAVITY.y;
    }
    this.particalCount = this.wz.totalParticle;
    this.setBlendMode(); // not sure this is right
    this.initialize();
  }
  static async createFromWz(name: string) {
    const path = `Effect/particle.img/${name}`;
    const data = await Assets.load<WzParticleData>({
      alias: path,
      loadParser: 'loadJson',
      src: `${$apiHost.get()}/node/json/${path}?force_parse=true&simple=true`,
    });
    const textureUrl = data.texture._outlink || data.texture.path;
    const texture = await Assets.load({
      alias: textureUrl,
      src: `${$apiHost.get()}/node/image/${textureUrl}?force_parse=true&cache=7200`,
      loadParser: 'loadTextures',
      format: '.webp',
    });
    return new ParticleEmitter(data, texture);
  }
  update(d: Ticker) {
    const delta = d.deltaMS * 0.001;

    const emitCount = this.emitPersecond * delta;
    for (let i = 0; i < emitCount; i++) {
      const particle = this.particles[this.index];

      if (!particle || particle.dead) {
        this.resetParticle(particle);
        particle.start();
        continue;
      }
      this.index++;
      if (this.index >= this.particles.length) {
        this.index = 0;
      }
    }
    for (const particle of this.particles) {
      if (particle.dead) {
        continue;
      }
      particle.update(delta);
    }
    this.container.update();
  }
  setBlendMode() {
    const src = this.wz.blendFuncSrc;
    const dst = this.wz.blendFuncDst;
    if (src === ParticleBlendFunc.SRC_ALPHA || (src as number) === 12) {
      if (
        dst === ParticleBlendFunc.ONE ||
        dst === ParticleBlendFunc.DST_ALPHA
      ) {
        this.container.blendMode = 'add';
      } else if (
        dst === ParticleBlendFunc.ONE_MINUS_SRC_ALPHA ||
        dst === ParticleBlendFunc.SRC_COLOR
      ) {
        this.container.blendMode = 'normal';
      }
      return;
    }
    if (
      src === ParticleBlendFunc.ZERO &&
      dst === ParticleBlendFunc.ONE_MINUS_SRC_ALPHA
    ) {
      this.container.blendMode = 'multiply';
    }
  }
  initialize() {
    const particleCount = this.particalCount || 200;
    for (let i = 0; i < particleCount; i++) {
      const particleItem = this.createParticle();
      this.particles.push(particleItem);
      this.container.addParticle(particleItem.particle);
    }
  }
  generateParticleData() {
    const data = {} as ParticleItemOptions & ParticleOptions;
    const startSize = this.randomRangeUnit(
      this.wz.startSize,
      this.wz.startSizeVar,
    );
    const endSize = this.randomRangeUnit(this.wz.endSize, this.wz.endSizeVar);
    data.scaleBegin = startSize / this.texture.width;
    data.scaleEnd = endSize / this.texture.width;
    data.colorBegin = this.randomColor(this.startColor, this.startColorVar);
    data.colorEnd = this.randomColor(this.endColor, this.endColorVar);
    data.rotationBegin = this.randomRange(
      this.wz.startSpin,
      this.wz.startSpinVar,
    );
    data.rotationEnd = this.randomRange(this.wz.endSpin, this.wz.endSpinVar);
    data.lifeTime = this.randomRange(this.wz.life, this.wz.lifeVar);
    /* particals */
    data.texture = this.texture;
    data.x = this.randomRange(this.wz.posX, this.wz.posVarX);
    data.y = this.randomRange(this.wz.posY, this.wz.posVarY);
    data.scaleX = data.scaleBegin;
    data.scaleY = data.scaleBegin;
    data.rotation = data.rotationBegin;
    data.tint = data.colorBegin;
    return data;
  }
  setRandomParticleData(particle: ParticleItem) {
    const speed = this.randomRange(
      this.wz.GRAVITY?.speed || 1,
      this.wz.GRAVITY?.speedVar || 1,
    );
    const angle = this.randomRange(this.wz.angle, this.wz.angleVar);
    const radians = (angle * Math.PI) / 180;
    const dir = new Point(Math.cos(radians), -Math.sin(radians));
    dir.x *= speed;
    dir.y *= speed;
    particle.dir = dir;
    if (this.wz.GRAVITY?.rotationIsDir === 1) {
      const rotationRange = particle.rotationEnd - particle.rotationBegin;
      particle.rotationBegin = angle;
      particle.scaleEnd = (angle + rotationRange) / this.texture.width;
    }

    if (this.wz.RADIUS) {
      particle.radiusBegin = this.randomRange(
        this.wz.RADIUS.startRadius,
        this.wz.RADIUS.startRadiusVar,
      );
      particle.radiusEnd = this.randomRange(
        this.wz.RADIUS.endRadius,
        this.wz.RADIUS.endRadiusVar,
      );
      particle.rotationSpeed = this.randomRange(
        this.wz.RADIUS.rotatePerSecond,
        this.wz.RADIUS.rotatePerSecondVar,
      );
    } else {
      particle.radiusBegin = 0;
      particle.radiusEnd = 0;
      particle.rotationSpeed = 0;
    }
    particle.angle = angle;

    particle.radialAccel = this.randomRange(
      this.wz.GRAVITY?.radialAccel || 0,
      this.wz.GRAVITY?.radialAccelVar || 0,
    );
    particle.tangentialAccel = this.randomRange(
      this.wz.GRAVITY?.tangentialAccel || 0,
      this.wz.GRAVITY?.tangentialAccelVar || 0,
    );

    return particle;
  }
  createParticle() {
    const data = this.generateParticleData();
    const particle = new ParticleItem(data, this);
    return this.setRandomParticleData(particle);
  }
  resetParticle(particle: ParticleItem) {
    const data = this.generateParticleData();
    particle.scaleBegin = data.scaleBegin;
    particle.scaleEnd = data.scaleEnd;
    particle.colorBegin = data.colorBegin as Color;
    particle.colorEnd = data.colorEnd as Color;
    particle.rotationBegin = data.rotationBegin;
    particle.rotationEnd = data.rotationEnd;
    particle.lifeTime = data.lifeTime;
    /* particals */
    particle.particle.x = data.x!;
    particle.particle.y = data.y!;
    particle.particle.scaleX = data.scaleX!;
    particle.particle.scaleY = data.scaleY!;
    particle.particle.rotation = data.rotation!;
    particle.particle.tint = data.tint!;
    return this.setRandomParticleData(particle);
  }
  randomRange(value: number, range: number) {
    if (range === 0) {
      return value;
    }
    return value + Math.random() * range;
  }
  randomRangeUnit(value: number, range: number) {
    const v = this.randomRange(value, range);
    return v < 0 ? 0 : v;
  }
  randomPoint(value: PointData, range: PointData) {
    return {
      x: this.randomRange(value.x, range.x),
      y: this.randomRange(value.y, range.y),
    };
  }
  randomColor(value: Color, range: Color) {
    const baseColor = value.toArray();
    const rangeColor = range.toArray();
    return new Color([
      this.randomRange(baseColor[0], rangeColor[0]),
      this.randomRange(baseColor[1], rangeColor[1]),
      this.randomRange(baseColor[2], rangeColor[2]),
      this.randomRange(baseColor[3], rangeColor[3]),
    ]);
  }
  createColorFromNumber(rgba: number) {
    return new Color([
      ((rgba >> 16) & 0xff) / 255,
      ((rgba >> 8) & 0xff) / 255,
      (rgba & 0xff) / 255,
      ((rgba >> 24) & 0xff) / 255,
    ]);
  }
}
