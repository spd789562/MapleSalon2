import { Color, Particle, Point, type Texture } from 'pixi.js';
import 'pixi.js/math-extras';
import type { ParticleEmitter } from './particleEmitter';

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

  constructor(texture: Texture, emitter: ParticleEmitter) {
    this.emitter = emitter;
    this.lifeTime = 0;
    this.life = 0;
    this.lifePercent = 1;

    this.scaleBegin = 0;
    this.scaleEnd = 0;

    this.alphaBegin = 0;
    this.alphaEnd = 0;

    this.rotationBegin = 0;
    this.rotationEnd = 0;
    this.rotationSpeed = 0;

    this.colorBegin = new Color();
    this.colorEnd = new Color();
    this.color = new Color();

    this.radiusBegin = 0;
    this.radiusEnd = 0;
    this.angle = 0;

    this.dir = new Point();
    this.radialAccel = 0;
    this.tangentialAccel = 0;

    this.particle = new Particle(texture);
    this.particle.alpha = 0;
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
    // acc direction -> pos.normalize
    const accDir = this.emitter.accDirTmp.copyFrom({
      x: this.particle.x,
      y: this.particle.y,
    });
    if (accDir.x !== 0 || accDir.y !== 0) {
      accDir.normalize(accDir);
    }
    // rad = accDri * radialAccel
    const radial = this.emitter.radialTmp.copyFrom(accDir).multiply(
      {
        x: this.radialAccel,
        y: this.radialAccel,
      },
      this.emitter.radialTmp,
    );
    const tangent = this.emitter.tangentTmp; // tengent seems not used according to WCR2
    // acc = radial + tangent + gravity
    const acc = radial.add(tangent, radial).add(this.emitter.gravity, radial);
    // dir = dir + acc * deltaSec
    this.dir.add(acc.multiply({ x: deltaSec, y: deltaSec }, acc), this.dir);
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
    this.particle.alpha = this.calculateAlpha();
    this.particle.tint = this.color;
    this.particle.rotation = this.lerp(this.rotationBegin, this.rotationEnd, t);
    const scale = this.lerp(this.scaleBegin, this.scaleEnd, t);
    this.particle.scaleX = scale;
    this.particle.scaleY = scale;
  }
  calculateAlpha() {
    const t = this.lifePercent;
    const alphaPoints = this.emitter.alphaPoints;
    if (alphaPoints.length === 0) {
      return this.lerp(this.colorBegin.alpha, this.colorEnd.alpha, t);
    }
    // only one mid point - 0 to mid
    if (t < alphaPoints[0][1]) {
      return this.lerp(
        this.colorBegin.alpha,
        alphaPoints[0][0],
        t / alphaPoints[0][1],
      );
    }
    if (alphaPoints[1]) {
      // mid0 to mid1
      if (t < alphaPoints[1][1]) {
        return this.lerp(
          alphaPoints[0][0],
          alphaPoints[1][0],
          (t - alphaPoints[0][1]) / (alphaPoints[1][1] - alphaPoints[0][1]),
        );
      }
      // mid1 to 1
      return this.lerp(
        alphaPoints[1][0],
        this.colorEnd.alpha,
        (t - alphaPoints[1][1]) / (1 - alphaPoints[1][1]),
      );
    }
    // only one mid point - mid to 1
    return this.lerp(
      alphaPoints[0][0],
      this.colorEnd.alpha,
      (t - alphaPoints[0][1]) / (1 - alphaPoints[0][1]),
    );
  }
  /* not sure where to use it */
  claculateSpeed() {
    const t = this.lifePercent;
    const speedPoints = this.emitter.speedPoints;
    if (speedPoints.length === 0) {
      return 1;
    }
    for (let i = 1; i < speedPoints.length; i++) {
      const start = speedPoints[i - 1];
      const end = speedPoints[i];
      if (t >= start[1] && t <= end[1]) {
        return this.lerp(
          start[0],
          end[0],
          (t - start[1]) / (end[1] - start[1]),
        );
      }
    }
    return 1;
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
