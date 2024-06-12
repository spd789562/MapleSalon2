import { Filter, GlProgram, GpuProgram } from 'pixi.js';
import { vertex, wgslVertex } from 'pixi-filters';
import fragment from './hsvAdjustment.frag';
import source from './hsvAdjustment.wgsl';

export enum ColorRange {
  All = 0,
  Red = 1,
  Yellow = 2,
  Green = 3,
  Cyan = 4,
  Blue = 5,
  Purple = 6,
}

const MapleColorRange = {
  [ColorRange.All]: [0, 1],
  [ColorRange.Red]: [0, 0.1],
  [ColorRange.Yellow]: [0.1, 0.25],
  [ColorRange.Green]: [0.25, 0.42],
  [ColorRange.Cyan]: [0.42, 0.59],
  [ColorRange.Blue]: [0.59, 0.75],
  [ColorRange.Purple]: [0.75, 1],
};

/**
 * Options for the HsvAdjustmentFilter constructor.
 */
export interface HsvAdjustmentFilterOptions {
  /**
   * The amount of hue in degrees (-180 to 180)
   * @default 0
   */
  hue: number;
  /**
   * The amount of color saturation (-1 to 1)
   * @default 0
   */
  saturation: number;
  /**
   * The amount of lightness (-1 to 1)
   * @default 0
   */
  lightness: number;
  /**
   * The filter effect range
   * @default ColorRange.All
   */
  colorRange: ColorRange;
}

/**
 *
 * This WebGPU filter has been ported from the WebGL renderer that was originally created by Viktor Persson (@vikpe)
 * the code is original from [pixi-filters/hsl-adjustment](https://github.com/pixijs/filters/blob/main/src/hsl-adjustment/HslAdjustmentFilter.ts)
 *
 * @class
 * @extends Filter
 */
export class HsvAdjustmentFilter extends Filter {
  /** Default values for options. */
  public static readonly DEFAULT_OPTIONS: HsvAdjustmentFilterOptions = {
    hue: 0,
    saturation: 0,
    lightness: 0,
    colorRange: ColorRange.All,
  };

  public uniforms: {
    uHsv: Float32Array;
    uColorStart: number;
    uColorEnd: number;
  };

  private _hue!: number;

  private _colorRange: ColorRange = ColorRange.All;

  /**
   * @param options - Options for the HsvAdjustmentFilter constructor.
   */
  constructor(options?: Partial<HsvAdjustmentFilterOptions>) {
    const localOption = { ...HsvAdjustmentFilter.DEFAULT_OPTIONS, ...options };

    const gpuProgram = GpuProgram.from({
      vertex: {
        source: wgslVertex,
        entryPoint: 'mainVertex',
      },
      fragment: {
        source,
        entryPoint: 'mainFragment',
      },
    });

    const glProgram = GlProgram.from({
      vertex,
      fragment,
      name: 'hsv-adjustment-filter',
    });

    const range = MapleColorRange[localOption.colorRange];

    super({
      gpuProgram,
      glProgram,
      resources: {
        hsvUniforms: {
          uHsv: { value: new Float32Array(3), type: 'vec3<f32>' },
          uColorStart: { value: range[0], type: 'f32' },
          uColorEnd: { value: range[1], type: 'f32' },
        },
      },
    });

    this.uniforms = this.resources.hsvUniforms.uniforms;
    this.hue = localOption.hue;
  }

  /**
   * The amount of hue in degrees (-180 to 180)
   * @default 0
   */
  get hue(): number {
    return this._hue;
  }
  set hue(value: number) {
    this._hue = value;
    this.resources.hsvUniforms.uniforms.uHsv[0] = value * (Math.PI / 180);
  }

  /**
   * The amount of lightness (-1 to 1)
   * @default 0
   */
  get saturation(): number {
    return this.resources.hsvUniforms.uniforms.uHsv[1];
  }
  set saturation(value: number) {
    this.resources.hsvUniforms.uniforms.uHsv[1] = value;
  }

  /**
   * The amount of lightness (-1 to 1)
   * @default 0
   */
  get lightness(): number {
    return this.resources.hsvUniforms.uniforms.uHsv[2];
  }
  set lightness(value: number) {
    this.resources.hsvUniforms.uniforms.uHsv[2] = value;
  }

  get colorRange(): ColorRange {
    return this._colorRange;
  }
  set colorRange(value: ColorRange) {
    this._colorRange = value;
    const range = MapleColorRange[value];
    this.resources.hsvUniforms.uniforms.uColorStart = range[0];
    this.resources.hsvUniforms.uniforms.uColorEnd = range[1];
  }
}
