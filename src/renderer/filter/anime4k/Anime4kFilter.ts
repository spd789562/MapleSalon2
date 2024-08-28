import {
  Filter,
  Texture,
  GpuProgram,
  Geometry,
  Point,
  type WebGPURenderer,
  type FilterSystem,
  type RenderSurface,
} from 'pixi.js';
import { wgslVertex } from 'pixi-filters';
import './Anime4kSystem';

import sampleExternalTextureFrag from './sampleExternalTexture.wgsl';

import type { PipelineOption } from './const';

const quadGeometry = new Geometry({
  attributes: {
    aPosition: {
      buffer: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]),
      format: 'float32x2',
      stride: 2 * 4,
      offset: 0,
    },
  },
  indexBuffer: new Uint32Array([0, 1, 2, 0, 2, 3]),
});

export class Anime4kFilter extends Filter {
  mainTexture: GPUTexture | undefined;
  _texture: GPUTexture | undefined;
  public readonly renderPipeId = 'anime4kRender';
  loadedPipeline: PipelineOption[] = [];

  constructor(pipelines: PipelineOption[]) {
    const gpuProgram = GpuProgram.from({
      vertex: {
        source: wgslVertex,
        entryPoint: 'mainVertex',
      },
      fragment: {
        source: sampleExternalTextureFrag,
        entryPoint: 'main',
      },
    });
    super({
      gpuProgram,
      resources: {},
    });
    this.loadedPipeline = pipelines;
  }
  public override apply(
    filterManager: FilterSystem,
    input: Texture,
    output: RenderSurface,
    clearMode: boolean,
  ) {
    const renderer = filterManager.renderer as WebGPURenderer;
    const globalBindGroup = this.getPixiGlobalBindGroup(
      filterManager,
      input,
      output,
    );
    this.groups[0] = globalBindGroup;

    /* FilterSystem done */

    const res = (filterManager.renderer as WebGPURenderer).texture.getGpuSource(
      /* @ts-ignore */
      input.source,
    );

    const sizeOption = {
      width: input.source.width,
      height: input.source.height,
    };
    const resource = renderer.anime4k.getSizedRenderResource(
      sizeOption,
      this.loadedPipeline,
    );

    /* copy incoming texture to mainTexture so anime4k can process it */
    renderer.encoder.commandEncoder.copyTextureToTexture(
      {
        texture: res,
      },
      {
        texture: resource[0],
      },
      [input.source.width, input.source.height, 1],
    );

    for (const pipe of resource[2]) {
      pipe.pass(renderer.encoder.commandEncoder);
    }

    renderer.renderTarget.bind(output, !!clearMode);

    renderer.encoder.setPipelineFromGeometryProgramAndState(
      quadGeometry,
      this.gpuProgram,
      this._state,
      'triangle-list',
    );
    renderer.encoder.setGeometry(quadGeometry, this.gpuProgram);

    /* @ts-ignore */
    renderer.encoder._syncBindGroup(globalBindGroup);
    /* @ts-ignore */
    renderer.encoder._boundBindGroup[0] = globalBindGroup;

    globalBindGroup._touch(renderer.textureGC.count);

    /* create a bindGroup and use last pipeline result as texture */
    const bindGroup = renderer.anime4k.getSizedBindGroup(sizeOption, {
      bindGroup: globalBindGroup,
      program: this.gpuProgram,
      groupIndex: 0,
      resourceView: resource[1],
    });

    renderer.encoder.setPipelineFromGeometryProgramAndState(
      quadGeometry,
      this.gpuProgram,
      this._state,
      'triangle-list',
    );
    renderer.encoder.setGeometry(quadGeometry, this.gpuProgram);
    renderer.encoder.renderPassEncoder.setBindGroup(0, bindGroup);
    renderer.encoder.renderPassEncoder.drawIndexed(
      quadGeometry.indexBuffer.data.length,
      quadGeometry.instanceCount,
      0,
    );
  }
  public updatePipeine() {
    /* TODO */
  }
  private getPixiGlobalBindGroup(
    filterManager: FilterSystem,
    input: Texture,
    output: RenderSurface,
  ) {
    const renderer = filterManager.renderer as WebGPURenderer;
    const renderTarget = renderer.renderTarget.getRenderTarget(output);
    const rootTexture = renderer.renderTarget.rootRenderTarget.colorTexture;
    /* FilterSystem stuff start, the code is just copy paste from pixi.js v8 src/filters/FilterSystem */
    /* @ts-ignore */
    const filterData =
      /* @ts-ignore */
      filterManager._filterStack[filterManager._filterStackIndex];
    const bounds = filterData.bounds;

    const offset = Point.shared;

    const previousRenderSurface = filterData.previousRenderSurface;

    const isFinalTarget = previousRenderSurface === output;

    let resolution = rootTexture.source._resolution;

    // to find the previous resolution we need to account for the skipped filters
    // the following will find the last non skipped filter...
    /* @ts-ignore */
    let currentIndex = this._filterStackIndex - 1;

    /* @ts-ignore */
    while (currentIndex > 0 && this._filterStack[currentIndex].skip) {
      --currentIndex;
    }

    if (currentIndex > 0) {
      resolution =
        /* @ts-ignore */
        this._filterStack[currentIndex].inputTexture.source._resolution;
    }

    /* it private it also necessary access that here */
    /* @ts-ignore */
    const filterUniforms = filterManager._filterGlobalUniforms;
    const uniforms = filterUniforms.uniforms;

    const outputFrame = uniforms.uOutputFrame;
    const inputSize = uniforms.uInputSize;
    const inputPixel = uniforms.uInputPixel;
    const inputClamp = uniforms.uInputClamp;
    const globalFrame = uniforms.uGlobalFrame;
    const outputTexture = uniforms.uOutputTexture;

    // are we rendering back to the original surface?
    if (isFinalTarget) {
      /* @ts-ignore */
      let lastIndex = filterManager._filterStackIndex;

      // get previous bounds.. we must take into account skipped filters also..
      while (lastIndex > 0) {
        lastIndex--;
        const filterData =
          /* @ts-ignore */
          filterManager._filterStack[filterManager._filterStackIndex - 1];

        if (!filterData.skip) {
          offset.x = filterData.bounds.minX;
          offset.y = filterData.bounds.minY;

          break;
        }
      }

      outputFrame[0] = bounds.minX - offset.x;
      outputFrame[1] = bounds.minY - offset.y;
    } else {
      outputFrame[0] = 0;
      outputFrame[1] = 0;
    }

    outputFrame[2] = input.frame.width;
    outputFrame[3] = input.frame.height;

    inputSize[0] = input.source.width;
    inputSize[1] = input.source.height;
    inputSize[2] = 1 / inputSize[0];
    inputSize[3] = 1 / inputSize[1];

    inputPixel[0] = input.source.pixelWidth;
    inputPixel[1] = input.source.pixelHeight;
    inputPixel[2] = 1.0 / inputPixel[0];
    inputPixel[3] = 1.0 / inputPixel[1];

    inputClamp[0] = 0.5 * inputPixel[2];
    inputClamp[1] = 0.5 * inputPixel[3];
    inputClamp[2] = input.frame.width * inputSize[2] - 0.5 * inputPixel[2];
    inputClamp[3] = input.frame.height * inputSize[3] - 0.5 * inputPixel[3];

    globalFrame[0] = offset.x * resolution;
    globalFrame[1] = offset.y * resolution;

    globalFrame[2] = rootTexture.source.width * resolution;
    globalFrame[3] = rootTexture.source.height * resolution;

    if (output instanceof Texture) {
      outputTexture[0] = output.frame.width;
      outputTexture[1] = output.frame.height;
    } else {
      // this means a renderTarget was passed directly
      outputTexture[0] = renderTarget.width;
      outputTexture[1] = renderTarget.height;
    }

    outputTexture[2] = renderTarget.isRoot ? -1 : 1;
    filterUniforms.update();

    /* @ts-ignore */
    const globalBindGroup = filterManager._globalFilterBindGroup;
    if (renderer.renderPipes.uniformBatch) {
      const batchUniforms =
        renderer.renderPipes.uniformBatch.getUboResource(filterUniforms);

      globalBindGroup.setResource(batchUniforms, 0);
    } else {
      globalBindGroup.setResource(filterUniforms, 0);
    }

    // now lets update the output texture...

    // set bind group..
    globalBindGroup.setResource(input.source, 1);
    globalBindGroup.setResource(input.source.style, 2);

    return globalBindGroup;
  }
}
