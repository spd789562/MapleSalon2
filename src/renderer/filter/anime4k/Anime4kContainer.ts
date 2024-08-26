import { RenderContainer, WebGPURenderer, WebGLRenderer } from 'pixi.js';

import type { Anime4KPipeline } from 'anime4k-webgpu';
import fullscreenTexturedQuadVert from './fullscreenTexturedQuad.wgsl';
import sampleExternalTextureFrag from './sampleExternalTexture.wgsl';

type Anime4kPipelineConstructor = new (desc: {
  device: GPUDevice;
  inputTexture: GPUTexture;
  nativeDimensions?: { width: number; height: number };
  targetDimensions?: { width: number; height: number };
}) => Anime4KPipeline;
export interface Anime4kPipelineWithOption {
  factory: Anime4kPipelineConstructor;
  params?: Record<string, number>;
}

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

const PipelineMap: Record<PipelineType, () => Promise<unknown>> = {
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
  params: Record<string, number>;
}

export class Anime4kContainer extends RenderContainer {
  mainTexture: GPUTexture | undefined;
  public readonly renderPipeId = 'anime4kRender';
  loadedPipeline: Anime4kPipelineWithOption[] = [];
  pipelineChain: Anime4KPipeline[] = [];

  _renderPipeline: GPURenderPipeline | undefined;
  _renderBindGroup: GPUBindGroup | undefined;

  constructor(pipelines: Anime4kPipelineWithOption[]) {
    super({
      render: (renderer) => {
        if (renderer instanceof WebGLRenderer) {
          this.glRender(renderer);
        }
        if (renderer instanceof WebGPURenderer) {
          this.gpuRender(renderer, pipelines);
        }
      },
    });
  }
  static loadPipeline(
    pipelines: (PipelineType | PipelineOption)[],
  ): Promise<Anime4kPipelineConstructor[]> {
    return Promise.all(
      pipelines.map((pipeline) => {
        if (typeof pipeline === 'string') {
          return PipelineMap[pipeline]() as Promise<Anime4kPipelineConstructor>;
        }
        return PipelineMap[
          pipeline.pipeline
        ]() as Promise<Anime4kPipelineConstructor>;
      }),
    );
  }
  init(
    device: GPUDevice,
    firstTexture: GPUTexture,
    pipelines: Anime4kPipelineWithOption[],
  ) {
    this.pipelineChain = pipelines.reduce(
      (chain: Anime4KPipeline[], pipeline, index) => {
        const inputTexture =
          index === 0 ? firstTexture : chain[index - 1].getOutputTexture();
        const pipeClass = pipeline.factory;
        const pipeOption = pipeline.params;
        const pipe = new pipeClass({
          device,
          inputTexture,
          nativeDimensions: {
            width: firstTexture.width,
            height: firstTexture.height,
          },
          targetDimensions: {
            width: firstTexture.width,
            height: firstTexture.height,
          },
        });
        if (pipeOption && typeof pipeOption !== 'string') {
          for (const [key, value] of Object.entries(pipeOption)) {
            pipe.updateParam(key, value);
          }
        }
        chain.push(pipe);
        return chain;
      },
      [] as Anime4KPipeline[],
    );
    const lastPipeline = this.pipelineChain[this.pipelineChain.length - 1];
    if (!lastPipeline) {
      return;
    }
    // render pipeline setups
    const renderBindGroupLayout = device.createBindGroupLayout({
      label: 'Render Bind Group Layout',
      entries: [
        {
          binding: 1,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: {},
        },
        {
          binding: 2,
          visibility: GPUShaderStage.FRAGMENT,
          texture: {},
        },
      ],
    });

    const renderPipelineLayout = device.createPipelineLayout({
      label: 'Render Pipeline Layout',
      bindGroupLayouts: [renderBindGroupLayout],
    });

    const renderPipeline = device.createRenderPipeline({
      layout: renderPipelineLayout,
      vertex: {
        module: device.createShaderModule({
          code: fullscreenTexturedQuadVert,
        }),
        entryPoint: 'vert_main',
      },
      fragment: {
        module: device.createShaderModule({
          code: sampleExternalTextureFrag,
        }),
        entryPoint: 'main',
        targets: [
          {
            format: navigator.gpu.getPreferredCanvasFormat(),
          },
        ],
      },
      primitive: {
        topology: 'triangle-list',
      },
    });

    const sampler = device.createSampler({
      magFilter: 'linear',
      minFilter: 'linear',
    });

    const renderBindGroup = device.createBindGroup({
      layout: renderBindGroupLayout,
      entries: [
        {
          binding: 1,
          resource: sampler,
        },
        {
          binding: 2,
          resource: lastPipeline.getOutputTexture().createView(),
        },
      ],
    });
    this._renderPipeline = renderPipeline;
    this._renderBindGroup = renderBindGroup;
  }
  updatePipeine() {
    /* TODO */
  }
  glRender(renderer: WebGLRenderer) {
    super.render(renderer);
  }
  gpuRender(renderer: WebGPURenderer, pipelines: Anime4kPipelineWithOption[]) {
    super.render(renderer);

    const device = renderer.device.gpu.device;
    const colorTexture = renderer.renderTarget.renderTarget.colorTexture;
    const gpuRenderTarget = renderer.renderTarget.getGpuRenderTarget(
      renderer.renderTarget.renderTarget,
    );
    const context = gpuRenderTarget.contexts[0];
    const currentTexture = context.getCurrentTexture();

    if (!this.mainTexture) {
      this.mainTexture = device.createTexture({
        size: [colorTexture.width, colorTexture.height, 1],
        format: 'rgba8unorm',
        usage:
          GPUTextureUsage.TEXTURE_BINDING |
          GPUTextureUsage.COPY_DST |
          GPUTextureUsage.RENDER_ATTACHMENT,
      });
      this.init(device, this.mainTexture, pipelines);
    }

    if (!context || this.pipelineChain.length === 0) {
      console.info('render canceled');
      return;
    }
    device.queue.copyExternalImageToTexture(
      { source: context.canvas },
      { texture: this.mainTexture },
      [colorTexture.width, colorTexture.height],
    );

    const commandEncoder = device.createCommandEncoder();
    for (const pipe of this.pipelineChain) {
      pipe.pass(commandEncoder);
    }
    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: currentTexture.createView(),
          clearValue: {
            r: 0.0,
            g: 0.0,
            b: 0.0,
            a: 1.0,
          },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    });
    passEncoder.setPipeline(this._renderPipeline!);
    passEncoder.setBindGroup(0, this._renderBindGroup!);
    passEncoder.draw(6);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }
}
