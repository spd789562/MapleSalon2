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
  life: number;
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
    this.life = this.lifeTime;
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
    this.life += deltaSec;
    this.lifePercent = this.life / this.lifeTime;
    if (this.lifePercent >= 1) {
      this.dead = true;
      this.particle.alpha = 0;
      this.particle.x = 0;
      this.particle.y = 0;
      return;
    }
    const accDir = this.emitter.accDirTmp.copyFrom({
      x: this.particle.x,
      y: this.particle.y,
    });
    if (accDir.x !== 0 || accDir.y !== 0) {
      accDir.normalize(accDir);
    }
    const radial = this.emitter.radialTmp.copyFrom(accDir).multiply(
      {
        x: this.radialAccel,
        y: this.radialAccel,
      },
      this.emitter.radialTmp,
    );
    const tangent = this.emitter.tangentTmp; // tengent seems not used according to WCR2
    const acc = radial.add(tangent, radial).add(this.emitter.gravity, radial);
    this.dir.add(acc.multiply({ x: deltaSec, y: deltaSec }), this.dir);
    this.particle.x += this.dir.x * deltaSec;
    this.particle.y += this.dir.y * deltaSec;

    this.angle += this.rotationSpeed * deltaSec;
    const t = this.lifePercent;
    const rad = this.lerp(this.radiusBegin, this.radiusEnd, t);
    if (rad > 0) {
      const radian = (this.angle * Math.PI) / 180;
      this.particle.x += Math.cos(radian) * rad * deltaSec;
      this.particle.y += Math.sin(radian) * rad * deltaSec;
    }
    this.color.setValue([
      this.lerp(this.colorBegin.red, this.colorEnd.red, t),
      this.lerp(this.colorBegin.green, this.colorEnd.green, t),
      this.lerp(this.colorBegin.blue, this.colorEnd.blue, t),
    ]);
    this.particle.alpha = this.lerp(
      this.colorBegin.alpha,
      this.colorEnd.alpha,
      t,
    );
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
    this.life = 0;
    this.lifePercent = 0;
    this.particle.alpha = 1;
    this.particle.scaleX = this.scaleBegin;
    this.particle.scaleY = this.scaleBegin;
    this.particle.rotation = this.rotationBegin;
    this.particle.tint = this.colorBegin;
    this.color.setValue(this.colorBegin);
  }
}
