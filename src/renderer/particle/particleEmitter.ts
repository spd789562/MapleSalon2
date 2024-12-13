import {
  Color,
  ParticleContainer,
  Assets,
  type PointData,
  type Texture,
  Point,
  type Ticker,
} from 'pixi.js';
import 'pixi.js/math-extras';
import { ParticleBlendFunc, type WzParticleData } from './const/wz';
import { ParticleItem } from './particleItem';

import { $apiHost } from '@/store/const';

export class ParticleEmitter {
  particles: ParticleItem[] = [];
  container: ParticleContainer;
  wz: WzParticleData;
  texture: Texture;
  textureRad: number;
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

  // [value, time]
  speedPoints: [number, number][] = []; // what does this do?
  alphaPoints: [number, number][] = [];

  _emitTimer = 0;
  _emitFrequency = 0;
  _active = 0;

  index = 0;

  constructor(particleData: WzParticleData, texture: Texture) {
    this.wz = particleData;
    this.container = new ParticleContainer();
    this.texture = texture;
    this.startColor = this.createColorFromNumber(particleData.startColor);
    this.startColorVar = this.createColorFromNumber(particleData.startColorVar);
    this.endColor = this.createColorFromNumber(particleData.endColor);
    this.endColorVar = this.createColorFromNumber(particleData.endColorVar);
    this.particalCount = particleData.totalParticle;
    if (particleData.duration > 0) {
      this.emitPersecond =
        this.particalCount / Math.min(particleData.duration, 1);
    } else {
      const minLife = Math.max(0, particleData.life - particleData.lifeVar);
      const maxLife = Math.max(0, particleData.life + particleData.lifeVar);
      this.emitPersecond = this.particalCount / ((minLife + maxLife) / 2);
    }
    this._emitFrequency = 1 / this.emitPersecond;
    if (particleData.GRAVITY) {
      this.gravity.x = particleData.GRAVITY.x;
      this.gravity.y = particleData.GRAVITY.y;
    }
    // x^2 + y^2 = r^2
    this.textureRad =
      Math.sqrt(this.texture.width ** 2 + this.texture.height ** 2) *
      Math.SQRT2;
    this.genSpeedPoints();
    this.genAlphaPoints();
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
  get nextParitcle() {
    const particle = this.particles[this.index];
    if (this.index + 1 >= this.particles.length) {
      this.index = 0;
    } else {
      this.index += 1;
    }
    return particle;
  }
  genSpeedPoints() {
    const speedPoints = this.wz.SpeedPoint;
    if (!speedPoints) {
      return;
    }
    for (const pointData of Object.values(speedPoints)) {
      this.speedPoints.push([pointData.speed, pointData.time]);
    }
    this.speedPoints.sort((a, b) => a[1] - b[1]);
  }
  genAlphaPoints() {
    if (this.wz.MiddlePoint0 > 0) {
      this.alphaPoints.push([
        this.wz.MiddlePointAlpha0 / 255,
        this.wz.MiddlePoint0 / 100,
      ]);
    }
    if (this.wz.MiddlePoint1 > 0) {
      this.alphaPoints.push([
        this.wz.MiddlePointAlpha1 / 255,
        this.wz.MiddlePoint1 / 100,
      ]);
    }
  }
  clone() {
    return new ParticleEmitter(this.wz, this.texture);
  }
  update(d: Ticker) {
    const delta = d.deltaMS * 0.001;

    this._emitTimer -= Math.max(0, delta);

    if (this._emitTimer <= 0) {
      this._emitTimer = Math.max(
        this._emitFrequency,
        this._emitTimer + this._emitFrequency,
      );
      this.tryEmit(delta);
    }
    for (const particle of this.particles) {
      if (particle.dead) {
        continue;
      }
      particle.update(delta);
      if (particle.dead) {
        this._active -= 1;
      }
    }
    this.container.update();
  }
  tryEmit(deltaSec: number) {
    const ramining = this.particalCount - this._active;
    if (ramining <= 0) {
      return;
    }
    const _emitCount = Math.max(1, this.emitPersecond * deltaSec);
    const emitCount = Math.min(ramining, _emitCount);
    for (let i = 0; i < emitCount; i++) {
      const particle = this.nextParitcle;
      if (particle.dead) {
        this.resetParticle(particle);
        particle.start();
        this._active += 1;
      } else {
        // try find next dead particle
        i -= i === 0 ? 0 : 1;
      }
    }
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
    this.setBlendMode(); // not sure this is right
  }
  setRandomParticleData(particleItem: ParticleItem) {
    const startSize = this.randomRangeUnit(
      this.wz.startSize,
      this.wz.startSizeVar,
    );
    const endSize = this.randomRangeUnit(this.wz.endSize, this.wz.endSizeVar);
    particleItem.particle.anchorX = 0.5;
    particleItem.particle.anchorY = 0.5;
    particleItem.scaleBegin = startSize / this.textureRad;
    particleItem.scaleEnd = endSize / this.textureRad;
    particleItem.colorBegin.setValue(
      this.randomColor(this.startColor, this.startColorVar),
    );
    particleItem.colorEnd.setValue(
      this.randomColor(this.endColor, this.endColorVar),
    );
    particleItem.rotationBegin =
      (this.randomRangeUnit(this.wz.startSpin, this.wz.startSpinVar) *
        Math.PI) /
      180;
    particleItem.rotationEnd =
      (this.randomRangeUnit(this.wz.endSpin, this.wz.endSpinVar) * Math.PI) /
      180;
    particleItem.lifeTime = this.randomRangeUnit(this.wz.life, this.wz.lifeVar);
    particleItem.life = 0;
    particleItem.lifePercent = 0;

    const speed = this.randomRangeUnit(
      this.wz.GRAVITY?.speed || 1,
      this.wz.GRAVITY?.speedVar || 1,
    );
    const angle = this.randomRange(this.wz.angle, this.wz.angleVar);
    const radians = (angle * Math.PI) / 180;
    const dir = new Point(Math.cos(radians), -Math.sin(radians));
    dir.x *= speed;
    dir.y *= speed;
    particleItem.dir = dir;
    if (this.wz.GRAVITY?.rotationIsDir === 1) {
      const rotationRange =
        particleItem.rotationEnd - particleItem.rotationBegin;
      particleItem.rotationBegin = angle;
      particleItem.scaleEnd = (angle + rotationRange) / this.texture.width;
    }

    if (this.wz.RADIUS) {
      particleItem.radiusBegin = this.randomRange(
        this.wz.RADIUS.startRadius,
        this.wz.RADIUS.startRadiusVar,
      );
      particleItem.radiusEnd = this.randomRange(
        this.wz.RADIUS.endRadius,
        this.wz.RADIUS.endRadiusVar,
      );
      particleItem.rotationSpeed = this.randomRange(
        this.wz.RADIUS.rotatePerSecond,
        this.wz.RADIUS.rotatePerSecondVar,
      );
    }
    particleItem.angle = angle;

    if (this.wz.GRAVITY) {
      particleItem.radialAccel = this.randomRange(
        this.wz.GRAVITY.radialAccel,
        this.wz.GRAVITY.radialAccelVar,
      );
      particleItem.tangentialAccel = this.randomRange(
        this.wz.GRAVITY.tangentialAccel,
        this.wz.GRAVITY.tangentialAccelVar,
      );
    }

    /* set actual partical data */
    particleItem.particle.x = this.randomRange(this.wz.posX, this.wz.posVarX);
    particleItem.particle.y = this.randomRange(this.wz.posY, this.wz.posVarY);
    particleItem.particle.scaleX = particleItem.scaleBegin;
    particleItem.particle.scaleY = particleItem.scaleBegin;
    particleItem.particle.rotation = particleItem.rotationBegin;
    particleItem.particle.tint = particleItem.colorBegin;
    return particleItem;
  }
  createParticle() {
    return new ParticleItem(this.texture, this);
  }
  resetParticle(particle: ParticleItem) {
    return this.setRandomParticleData(particle);
  }
  randomRange(value: number, range: number) {
    if (range === 0) {
      return value;
    }
    return value - range + Math.random() * range * 2;
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
    return Color.shared.setValue([
      this.randomRangeUnit(baseColor[0], rangeColor[0]),
      this.randomRangeUnit(baseColor[1], rangeColor[1]),
      this.randomRangeUnit(baseColor[2], rangeColor[2]),
      this.randomRangeUnit(baseColor[3], rangeColor[3]),
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
  destroy() {
    this.container.destroy();
    this.particles = [];
  }
}
