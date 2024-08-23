import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';

import { $upscaleSource } from '@/store/expirement/upscale';
import { usePureStore } from '@/store';

import {
  PipelineType,
  createGpuDevice,
  createRendererWithPipelines,
  type GpuResource,
  type Anime4KRenderer,
  type PipelineOption,
} from '@/renderer/filter/anime4k';

import { toaster } from '@/components/GlobalToast';

export const UpscaleCharacter = () => {
  const source = usePureStore($upscaleSource);
  const [isInit, setIsInit] = createSignal<boolean>(false);
  let canvasRef!: HTMLCanvasElement;
  let requestId: number | null = null;
  let gpuResource: GpuResource | null = null;
  let renderer: Anime4KRenderer | null = null;
  const useType: (PipelineOption | PipelineType)[] = [
    {
      pipeline: PipelineType.BilateralMean,
      params: {
        strength: 0.2,
        strength2: 1,
      },
    },
    {
      pipeline: PipelineType.Dog,
      params: {
        strength: 2,
      },
    },
    PipelineType.CNNSoftVL,
  ];

  onMount(async () => {
    const soruceCanvas = source();
    if (!soruceCanvas) {
      return;
    }
    try {
      gpuResource = await createGpuDevice(canvasRef);

      renderer = await createRendererWithPipelines(soruceCanvas, canvasRef, {
        ...gpuResource,
        pipelines: useType,
      });
      setIsInit(true);
    } catch (e) {
      console.error(e);
      toaster.error({
        title: '無法初始化 WebGPU',
        description: '請確保您的 Webview 版本支援 WebGPU。',
      });
    }
  });

  onCleanup(() => {
    if (requestId) {
      cancelAnimationFrame(requestId);
    }
    if (gpuResource) {
      gpuResource.context.unconfigure();
    }
  });

  createEffect(async () => {
    if (!isInit()) {
      return;
    }
    const sourceCanvas = source();
    function frame() {
      if (renderer && sourceCanvas) {
        renderer.updateFrameTexture();
        renderer.render();
      }
    }
    function loop() {
      frame();
      requestId = requestAnimationFrame(loop);
    }
    requestId = requestAnimationFrame(loop);
  });

  return <canvas ref={canvasRef} width="300" height="340" />;
};
