import type { Anime4KPipeline } from 'anime4k-webgpu';
import fullscreenTexturedQuadVert from './fullscreenTexturedQuad.wgsl';
import sampleExternalTextureFrag from './sampleExternalTexture.wgsl';

type Anime4kPipelineConstructor = new (desc: {
  device: GPUDevice;
  inputTexture: GPUTexture;
  nativeDimensions?: { width: number; height: number };
  targetDimensions?: { width: number; height: number };
}) => Anime4KPipeline;

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

export type GpuResource = {
  device: GPUDevice;
  context: GPUCanvasContext;
};

export async function createGpuDevice(canvas: HTMLCanvasElement) {
  const adapter = await navigator.gpu.requestAdapter();
  if (!adapter) {
    throw new Error('WebGPU is not supported');
  }
  const device = await adapter.requestDevice({
    label: 'Test Anime4k GPU Device',
  });
  const context = canvas.getContext('webgpu') as GPUCanvasContext;
  const presentationFormat = navigator.gpu.getPreferredCanvasFormat();
  context.configure({
    device,
    format: presentationFormat,
    alphaMode: 'premultiplied',
  });

  return { device, context };
}

export interface PipelineOption {
  pipeline: PipelineType;
  params: Record<string, number>;
}

export interface CreateRendererOptions {
  device: GPUDevice;
  context: GPUCanvasContext;
  pipelines: (PipelineType | PipelineOption)[];
}

export type Anime4KRenderer = {
  render: () => void;
  updateFrameTexture: () => void;
};

export async function createRendererWithPipelines(
  sourceCanvas: HTMLCanvasElement,
  destCanvas: HTMLCanvasElement,
  options: CreateRendererOptions,
) {
  const { device, context, pipelines } = options;
  const { width: WIDTH, height: HEIGHT } = sourceCanvas;

  destCanvas.width = WIDTH;
  destCanvas.height = HEIGHT;

  const mainTexture = device.createTexture({
    size: [WIDTH, HEIGHT, 1],
    format: 'rgba16float',
    usage:
      GPUTextureUsage.TEXTURE_BINDING |
      GPUTextureUsage.COPY_DST |
      GPUTextureUsage.RENDER_ATTACHMENT,
  });

  const loadPipelines = await Promise.all(
    pipelines.map((pipeline) => {
      if (typeof pipeline === 'string') {
        return PipelineMap[pipeline]();
      }
      return PipelineMap[pipeline.pipeline]();
    }),
  );

  const pipelineChain: Anime4KPipeline[] = loadPipelines.reduce(
    (chain: Anime4KPipeline[], pipeline, index) => {
      const inputTexture =
        index === 0 ? mainTexture : chain[index - 1].getOutputTexture();
      const pipeClass = pipeline as Anime4kPipelineConstructor;
      const pipeOption = pipelines[index];
      const pipe = new pipeClass({
        device,
        inputTexture,
        nativeDimensions: { width: WIDTH, height: HEIGHT },
        targetDimensions: { width: WIDTH, height: HEIGHT },
      });
      if (typeof pipeOption !== 'string' && pipeOption.params) {
        for (const [key, value] of Object.entries(pipeOption.params)) {
          pipe.updateParam(key, value);
        }
      }
      chain.push(pipe);
      return chain;
    },
    [] as Anime4KPipeline[],
  );

  const lastPipeline = pipelineChain[pipelineChain.length - 1];
  // const lastTexture = lastPipeline.getOutputTexture();
  // destCanvas.width = lastTexture.width;
  // destCanvas.height = lastTexture.height;

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

  function updateFrameTexture() {
    device.queue.copyExternalImageToTexture(
      { source: sourceCanvas },
      { texture: mainTexture },
      [WIDTH, HEIGHT],
    );
  }
  function render() {
    let textureView: GPUTextureView | undefined;
    try {
      textureView = context.getCurrentTexture().createView();
    } catch (e) {
      console.info('render canceled');
    }
    if (!textureView) {
      return;
    }
    const commandEncoder = device.createCommandEncoder();
    for (const pipe of pipelineChain) {
      pipe.pass(commandEncoder);
    }
    const passEncoder = commandEncoder.beginRenderPass({
      colorAttachments: [
        {
          view: textureView,
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
    passEncoder.setPipeline(renderPipeline);
    passEncoder.setBindGroup(0, renderBindGroup);
    passEncoder.draw(6);
    passEncoder.end();
    device.queue.submit([commandEncoder.finish()]);
  }

  return { render, updateFrameTexture };
}
