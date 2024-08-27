import {
  extensions,
  ExtensionType,
  type WebGPURenderer,
  type Renderer,
  type System,
  type GpuProgram,
  type BindGroup,
  type UniformGroup,
  type TextureStyle,
  type BufferResource,
  type Buffer,
  type BindResource,
  type GPU,
} from 'pixi.js';
import type { Anime4KPipeline } from 'anime4k-webgpu';
import {
  PipelineMap,
  type PipelineType,
  type PipelineOption,
  type Anime4kPipelineConstructor,
} from './const';

export type SizedRenderResourceTuple = [
  GPUTexture,
  GPUTextureView,
  Anime4KPipeline[],
];

export class Anime4kFilterSystem implements System {
  public static extension = {
    type: [ExtensionType.WebGPUSystem],
    name: 'anime4k',
  } as const;

  private _renderer: Renderer;
  private _pipelineMap: Map<PipelineType, Anime4kPipelineConstructor> =
    new Map();
  private _sizedPipelineMap: Map<string, Map<string, Anime4KPipeline>> =
    new Map();
  private _sizedRenderMap: Map<string, SizedRenderResourceTuple> =
    new Map();
  private _sizedBindGroupMap: Map<string, GPUBindGroup> = new Map();
  private _gpu!: GPU;

  constructor(renderer: Renderer) {
    this._renderer = renderer;
  }

  protected contextChange(gpu: GPU): void {
    this._gpu = gpu;
  }

  public destroy(): void {
    /* @ts-ignore */
    this._renderer = null;
  }
  public clear(): void {
    this._sizedRenderMap.clear();
    this._sizedBindGroupMap.clear();
    this._sizedPipelineMap.clear();
  }

  public preparePipeline(pipelines: PipelineType[]) {
    const unresolved = pipelines.filter((p) => !this._pipelineMap.has(p));
    return Promise.all(
      unresolved.map((p) =>
        PipelineMap[p]().then((m) =>
          this._pipelineMap.set(p, m as Anime4kPipelineConstructor),
        ),
      ),
    );
  }

  private getSizedPipeline(
    option: { width: number; height: number; inputTexture: GPUTexture },
    type: PipelineType,
    index: number,
  ) {
    const key = `${option.width}x${option.height}`;
    let sizedMap = this._sizedPipelineMap.get(key);
    if (!sizedMap) {
      sizedMap = new Map();
      this._sizedPipelineMap.set(key, sizedMap);
    }

    const pipelineClass = this._pipelineMap.get(type);
    if (!pipelineClass) {
      throw new Error(`Pipeline ${type} not prepared or not found`);
    }

    const pipelineKey = `${type}:${index}`;
    let targetPipeline = sizedMap.get(pipelineKey);

    if (!targetPipeline) {
      targetPipeline = new pipelineClass({
        device: this._gpu.device,
        inputTexture: option.inputTexture,
        nativeDimensions: {
          width: option.width,
          height: option.height,
        },
        targetDimensions: {
          width: option.width,
          height: option.height,
        },
      });
      sizedMap.set(pipelineKey, targetPipeline);
    }

    return targetPipeline;
  }
  getSizedRenderResource(
    option: {
      width: number;
      height: number;
    },
    pipelines: PipelineOption[],
  ) {
    const pipelineHash = pipelines.map((p) => p.pipeline).join(',');
    const key = `${option.width}x${option.height}:${pipelineHash}`;
    console.log(key);
    let resource = this._sizedRenderMap.get(key);
    if (!resource) {
      resource = this.setSizedRenderResource(option, pipelines);
      this._sizedRenderMap.set(key, resource);
    }

    return resource;
  }
  setSizedRenderResource(
    option: {
      width: number;
      height: number;
    },
    pipelines: PipelineOption[],
  ): SizedRenderResourceTuple {
    const device = this._gpu.device;
    const mainTexture = device.createTexture({
      size: [option.width, option.height, 1],
      format: 'bgra8unorm',
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.COPY_SRC |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });

    const pipelineChain = pipelines.reduce(
      (chain: Anime4KPipeline[], pipeline, index) => {
        const inputTexture =
          index === 0 ? mainTexture : chain[index - 1].getOutputTexture();
        const pipe = this.getSizedPipeline(
          {
            width: option.width,
            height: option.height,
            inputTexture,
          },
          pipeline.pipeline,
          index,
        );
        /* notice that just direct update, means all thing using this will also got update */
        if (pipeline.params) {
          for (const [key, value] of Object.entries(pipeline.params)) {
            pipe.updateParam(key, value);
          }
        }
        chain.push(pipe);
        return chain;
      },
      [] as Anime4KPipeline[],
    );
    const lastPipeline = pipelineChain[pipelineChain.length - 1];
    return [
      mainTexture,
      lastPipeline.getOutputTexture().createView(),
      pipelineChain,
    ];
  }
  getSizedBindGroup(
    option: { width: number; height: number },
    groupOption: {
      bindGroup: BindGroup;
      program: GpuProgram;
      groupIndex: number;
      resourceView: GPUTextureView;
    },
  ) {
    const key = `${option.width}x${option.height}`;
    let bindGroup = this._sizedBindGroupMap.get(key);
    if (!bindGroup) {
      bindGroup = this.setSizedBindGroup(groupOption);
      this._sizedBindGroupMap.set(key, bindGroup);
    }
    return bindGroup;
  }
  setSizedBindGroup(groupOption: {
    bindGroup: BindGroup;
    program: GpuProgram;
    groupIndex: number;
    resourceView: GPUTextureView;
  }) {
    const device = this._gpu.device;
    const renderer = this._renderer as WebGPURenderer;
    const { bindGroup, program, groupIndex, resourceView } = groupOption;
    const groupLayout = program.layout[groupIndex];
    const entries: GPUBindGroupEntry[] = [];

    for (const j in groupLayout) {
      const resource: BindResource =
        bindGroup.resources[j] ?? bindGroup.resources[groupLayout[j]];
      let gpuResource!:
        | GPUSampler
        | GPUTextureView
        | GPUExternalTexture
        | GPUBufferBinding;
      // TODO make this dynamic..

      if (resource._resourceType === 'uniformGroup') {
        const uniformGroup = resource as UniformGroup;

        renderer.ubo.updateUniformGroup(uniformGroup as UniformGroup);

        const buffer = uniformGroup.buffer as Buffer;

        gpuResource = {
          buffer: renderer.buffer.getGPUBuffer(buffer),
          offset: 0,
          size: buffer.descriptor.size,
        };
      } else if (resource._resourceType === 'buffer') {
        const buffer = resource as Buffer;

        gpuResource = {
          buffer: renderer.buffer.getGPUBuffer(buffer),
          offset: 0,
          size: buffer.descriptor.size,
        };
      } else if (resource._resourceType === 'bufferResource') {
        const bufferResource = resource as BufferResource;

        gpuResource = {
          buffer: renderer.buffer.getGPUBuffer(bufferResource.buffer),
          offset: bufferResource.offset,
          size: bufferResource.size,
        };
      } else if (resource._resourceType === 'textureSampler') {
        const sampler = resource as TextureStyle;

        gpuResource = renderer.texture.getGpuSampler(sampler);
      } else if (resource._resourceType === 'textureSource') {
        gpuResource = resourceView;
      }

      if (gpuResource) {
        entries.push({
          binding: groupLayout[j],
          resource: gpuResource,
        });
      }
    }

    const layout =
      renderer.shader.getProgramData(program).bindGroups[groupIndex];
    const gpuBindGroup = device.createBindGroup({
      layout,
      entries,
    });

    return gpuBindGroup;
  }
}

extensions.add(Anime4kFilterSystem);
