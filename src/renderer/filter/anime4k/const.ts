import type { Anime4KPipeline } from 'anime4k-webgpu';

export enum PipelineType {
  /**
   * deblur, must set param: strength
   *
   * @param strength Deblur Strength (0.1 - 15.0)
   */
  Dog = 'Dog',
  /**
   * denoise, must set param: strength, strength2
   *
   * @param strength Itensity Sigma (0.1 - 2.0)
   * @param strength2 Spatial Sigma (1 - 15)
   */
  BilateralMean = 'BilateralMean',

  /** restore */
  CNNM = 'CNNM',
  /** restore */
  CNNSoftM = 'CNNSoftM',
  /** restore */
  CNNSoftVL = 'CNNSoftVL',
  /** restore */
  CNNVL = 'CNNVL',
  /** restore */
  CNNUL = 'CNNUL',
  /** restore */
  GANUUL = 'GANUUL',

  /** upscale */
  CNNx2M = 'CNNx2M',
  /** upscale */
  CNNx2VL = 'CNNx2VL',
  /** upscale */
  DenoiseCNNx2VL = 'DenoiseCNNx2VL',
  /** upscale */
  CNNx2UL = 'CNNx2UL',
  /** upscale */
  GANx3L = 'GANx3L',
  /** upscale */
  GANx4UUL = 'GANx4UUL',

  ClampHighlights = 'ClampHighlights',
  DepthToSpace = 'DepthToSpace',

  /* anime4k preset @see https://github.com/bloc97/Anime4K/blob/master/md/GLSL_Instructions_Advanced.md */
  /** Restore -> Upscale -> Upscale */
  ModeA = 'ModeA',
  /** Restore_Soft -> Upscale -> Upscale */
  ModeB = 'ModeB',
  /** Upscale_Denoise -> Upscale */
  ModeC = 'ModeC',
  /** Restore -> Upscale -> Restore -> Upscale */
  ModeAA = 'ModeAA',
  /** Restore_Soft -> Upscale -> Restore_Soft -> Upscale */
  ModeBB = 'ModeBB',
  /** Upscale_Denoise -> Restore -> Upscale */
  ModeCA = 'ModeCA',
}

export const PipelineMap: Record<PipelineType, () => Promise<unknown>> = {
  [PipelineType.Dog]: () => import('anime4k-webgpu').then((m) => m.DoG),
  [PipelineType.BilateralMean]: () =>
    import('anime4k-webgpu').then((m) => m.BilateralMean),

  [PipelineType.CNNM]: () => import('anime4k-webgpu').then((m) => m.CNNM),
  [PipelineType.CNNSoftM]: () =>
    import('anime4k-webgpu').then((m) => m.CNNSoftM),
  [PipelineType.CNNSoftVL]: () =>
    import('anime4k-webgpu').then((m) => m.CNNSoftVL),
  [PipelineType.CNNVL]: () => import('anime4k-webgpu').then((m) => m.CNNVL),
  [PipelineType.CNNUL]: () => import('anime4k-webgpu').then((m) => m.CNNUL),
  [PipelineType.GANUUL]: () => import('anime4k-webgpu').then((m) => m.GANUUL),

  [PipelineType.CNNx2M]: () => import('anime4k-webgpu').then((m) => m.CNNx2M),
  [PipelineType.CNNx2VL]: () => import('anime4k-webgpu').then((m) => m.CNNx2VL),
  [PipelineType.DenoiseCNNx2VL]: () =>
    import('anime4k-webgpu').then((m) => m.DenoiseCNNx2VL),
  [PipelineType.CNNx2UL]: () => import('anime4k-webgpu').then((m) => m.CNNx2UL),
  [PipelineType.GANx3L]: () => import('anime4k-webgpu').then((m) => m.GANx3L),
  [PipelineType.GANx4UUL]: () =>
    import('anime4k-webgpu').then((m) => m.GANx4UUL),

  [PipelineType.ClampHighlights]: () =>
    import('anime4k-webgpu').then((m) => m.ClampHighlights),
  [PipelineType.DepthToSpace]: () =>
    import('anime4k-webgpu').then((m) => m.DepthToSpace),

  [PipelineType.ModeA]: () => import('anime4k-webgpu').then((m) => m.ModeA),
  [PipelineType.ModeB]: () => import('anime4k-webgpu').then((m) => m.ModeB),
  [PipelineType.ModeC]: () => import('anime4k-webgpu').then((m) => m.ModeC),
  [PipelineType.ModeAA]: () => import('anime4k-webgpu').then((m) => m.ModeAA),
  [PipelineType.ModeBB]: () => import('anime4k-webgpu').then((m) => m.ModeBB),
  [PipelineType.ModeCA]: () => import('anime4k-webgpu').then((m) => m.ModeCA),
};
export interface PipelineOption {
  pipeline: PipelineType;
  params?: Record<string, number>;
}
export type Anime4kPipelineConstructor = new (desc: {
  device: GPUDevice;
  inputTexture: GPUTexture;
  nativeDimensions?: { width: number; height: number };
  targetDimensions?: { width: number; height: number };
}) => Anime4KPipeline;
export interface Anime4kPipelineWithOption {
  type: PipelineType;
  params?: Record<string, number>;
}
