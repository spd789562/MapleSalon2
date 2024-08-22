import { onMount, onCleanup, createEffect } from 'solid-js';

import { $upscaleSource } from '@/store/expirement/upscale';
import { $isAnimating } from '@/store/character/selector';
import { usePureStore } from '@/store';

// import WebSR from '@websr/websr';
// import Weight from '@websr/websr/weights/anime4k/cnn-2x-l.json?url';

import { toaster } from '@/components/GlobalToast';

export const UpscaleCharacter = () => {
  const source = usePureStore($upscaleSource);
  const isAnimating = usePureStore($isAnimating);
  let canvasRef!: HTMLCanvasElement;
  let requestId: number | null = null;
  // let webSR: WebSR | null = null;

  onMount(async () => {
    // const gpu = await WebSR.initWebGPU();
    //   if (!gpu) {
    //     toaster.error({
    //       title: '無法初始化 WebGPU',
    //       description: '請確保您的 Webview 版本支援 WebGPU。',
    //     });
    //     return;
    //   }
    //   const weights = await fetch(Weight).then((res) => res.json());
    //   webSR = new WebSR({
    //     resolution: {
    //       width: 300,
    //       height: 340,
    //     },
    //     network_name: 'anime4k/cnn-2x-l',
    //     weights,
    //     gpu,
    //     canvas: canvasRef,
    //   });
  });

  onCleanup(() => {
    if (requestId) {
      cancelAnimationFrame(requestId);
    }
    // if (webSR) {
    //   webSR.destroy();
    // }
  });

  createEffect(async () => {
    const sourceCanvas = source();
    async function frame() {
      // if (webSR && sourceCanvas) {
      //   const bitmap = await createImageBitmap(sourceCanvas, {
      //     premultiplyAlpha: 'premultiply',
      //   });
      //   await webSR.render(bitmap);
      // }
    }
    if (isAnimating()) {
      async function loop() {
        await frame();
        requestId = requestAnimationFrame(loop);
      }
      requestId = requestAnimationFrame(loop);
    } else {
      await frame();
    }
  });

  return <canvas ref={canvasRef} width="300" height="340" />;
};
