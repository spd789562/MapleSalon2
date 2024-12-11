import {
  Color,
  type ColorSource,
  Particle,
  type ParticleOptions,
  Point,
  type PointData,
} from 'pixi.js';
import type { ParticleEmitter } from './particleEmitter';

export interface ParticleItemOptions {
  scaleBegin: number;
  scaleEnd: number;

  alphaBegin: number;
  alphaEnd: number;

  rotationBegin: number;
  rotationEnd: number;
  rotationSpeed: number;

  radiusBegin: number;
  radiusEnd: number;

  colorBegin: ColorSource;
  colorEnd: ColorSource;

  lifeTime: number;
}

export class ParticleItem {
  lifeTime: number; // ms
  lifeRemain: number;
  lifePercent: number;

  scaleBegin: number;
  scaleEnd: number;

  alphaBegin: number;
  alphaEnd: number;

  rotationBegin: number;
  rotationEnd: number;
  rotationSpeed: number;

  colorBegin: Color;
  colorEnd: Color;
  color: Color;

  radiusBegin: number;
  radiusEnd: number;

  dir: Point;
  radialAccel: number;
  tangentialAccel: number;
  angle: number;

  particle: Particle;

  dead = true;

  emitter: ParticleEmitter;

  constructor(
    options: ParticleItemOptions & ParticleOptions,
    emitter: ParticleEmitter,
  ) {
    this.emitter = emitter;
    this.lifeTime = options.lifeTime;
    this.lifeRemain = this.lifeTime;
    this.lifePercent = 1;

    this.scaleBegin = options.scaleBegin;
    this.scaleEnd = options.scaleEnd;

    this.alphaBegin = options.alphaBegin;
    this.alphaEnd = options.alphaEnd;

    this.rotationBegin = options.rotationBegin;
    this.rotationEnd = options.rotationEnd;
    this.rotationSpeed = options.rotationSpeed;

    this.colorBegin = new Color(options.colorBegin);
    this.colorEnd = new Color(options.colorEnd);
    this.color = new Color(options.colorBegin);

    this.radiusBegin = options.radiusBegin;
    this.radiusEnd = options.radiusEnd;
    this.angle = 0;

    this.dir = new Point();
    this.radialAccel = 0;
    this.tangentialAccel = 0;

    this.particle = new Particle(options);
  }
  update(deltaSec: number) {
    if (this.dead) {
      return;
    }
    this.lifeRemain -= deltaSec;
    this.lifePercent = this.lifeRemain / this.lifeTime;
    if (this.lifeRemain <= 0) {
      this.dead = true;
      this.particle.alpha = 0;
      return;
    }
    const accDir = this.emitter.accDirTmp.copyFrom(this.dir);
    if (accDir.x !== 0 || accDir.y !== 0) {
      accDir.normalize();
    }
    const radial = this.emitter.radialTmp.copyFrom(accDir).multiply({
      x: this.radialAccel,
      y: this.radialAccel,
    });
    const tangent = this.emitter.tangentTmp; // tengent seems not used according to WCR2
    const acc = radial.add(tangent).add(this.emitter.gravity);
    this.dir.add(acc.multiply({ x: deltaSec, y: deltaSec }));
    this.particle.x += this.dir.x * deltaSec;
    this.particle.y += this.dir.y * deltaSec;

    this.angle += this.rotationSpeed * deltaSec;
    const t = 1 - this.lifePercent;
    const rad = this.lerp(this.radiusBegin, this.radiusEnd, t);
    if (rad > 0) {
      const radian = (this.angle * Math.PI) / 180;
      this.particle.x += Math.cos(radian) * rad * deltaSec;
      this.particle.y += Math.sin(radian) * rad * deltaSec;
    }
    this.color.setValue({
      r: this.lerp(this.colorBegin.red, this.colorEnd.red, t),
      g: this.lerp(this.colorBegin.green, this.colorEnd.green, t),
      b: this.lerp(this.colorBegin.blue, this.colorEnd.blue, t),
      a: this.lerp(this.colorBegin.alpha, this.colorEnd.alpha, t),
    });
    this.particle.tint = this.color;
    this.particle.rotation = this.lerp(this.rotationBegin, this.rotationEnd, t);
    const scale = this.lerp(this.scaleBegin, this.scaleEnd, t);
    this.particle.scaleX = scale;
    this.particle.scaleY = scale;
  }
  lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
  }
  start() {
    this.dead = false;
    this.lifeRemain = this.lifeTime;
    this.lifePercent = 0;
    this.particle.alpha = 1;
    this.color.setValue(this.colorBegin);
  }
}
