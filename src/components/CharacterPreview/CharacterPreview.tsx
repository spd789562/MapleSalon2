import { onCleanup, createEffect, createSignal, from, on } from 'solid-js';
import type { ReadableAtom } from 'nanostores';

import {
  $isGlobalRendererInitialized,
  $globalRenderer,
} from '@/store/renderer';
import type { CharacterData, CharacterItemInfo } from '@/store/character/store';
import {
  MAX_ZOOM,
  MIN_ZOOM,
  $zoomTarget,
  $previewZoomInfo,
  updateCenter,
  updateZoom,
} from '@/store/previewZoom';
import { $showUpscaledCharacter } from '@/store/trigger';
import { usePureStore } from '@/store';

import { Character } from '@/renderer/character/character';
import { ZoomContainer } from '@/renderer/ZoomContainer';
import { Anime4kFilter } from '@/renderer/filter/anime4k/Anime4kFilter';
import {
  PipelineType,
  type PipelineOption,
} from '@/renderer/filter/anime4k/const';

import { toaster } from '@/components/GlobalToast';

export interface CharacterPreviewViewProps {
  onLoad: () => void;
  onLoaded: () => void;
  ref?: (element: Character) => void;
  store: ReadableAtom<CharacterData>;
  target: string;
}
export const CharacterPreviewView = (props: CharacterPreviewViewProps) => {
  const zoomInfo = usePureStore($previewZoomInfo);
  const characterData = from(props.store);
  const isRendererInitialized = usePureStore($isGlobalRendererInitialized);
  const [isInit, setIsInit] = createSignal<boolean>(false);
  const isShowUpscale = usePureStore($showUpscaledCharacter);
  let container!: HTMLDivElement;
  let viewport: ZoomContainer | undefined;
  let upscaleFilter: Anime4kFilter | undefined;
  const ch = new Character();
  props.ref?.(ch);

  ch.loadEvent.addListener('loading', props.onLoad);
  ch.loadEvent.addListener('loaded', props.onLoaded);
  ch.loadEvent.addListener(
    'error',
    function onEquipLoadError(payload: CharacterItemInfo[]) {
      const names = payload.map((item) => item.name || item.id).join(', ');
      toaster.error({
        title: '裝備載入失敗',
        description: `下列裝備載入失敗：${names}`,
      });
    },
  );

  function initScene() {
    const app = $globalRenderer.get();
    app.renderer.resize(300, 340);
    viewport = new ZoomContainer(app, {
      width: 300,
      height: 340,
      worldScale: 2,
      maxScale: MAX_ZOOM,
    });
    const defaultInfo = zoomInfo();
    viewport.scaled = defaultInfo.zoom;
    viewport.moveCenter(defaultInfo.center);
    viewport.on('zoomed', (e) => {
      const viewport = e.viewport as ZoomContainer;
      if (
        viewport &&
        viewport.scaled <= MAX_ZOOM &&
        viewport.scaled >= MIN_ZOOM &&
        !viewport?.destroyed
      ) {
        const clampedScaled = (viewport.scaled * 100) / 100;
        viewport.scaled = clampedScaled;
        updateZoom(clampedScaled, props.target);
      }
    });
    viewport.on('moved', (e) => {
      const isNotClamp = !e.type.includes('clamp');
      if (viewport && isNotClamp) {
        updateCenter(viewport.center, props.target);
      }
    });
    container.appendChild(app.canvas);
    viewport.addChild(ch);
    app.stage.addChild(viewport);

    setIsInit(true);
  }

  createEffect(
    on(isRendererInitialized, (initialized) => {
      if (initialized) {
        initScene();
      }
    }),
  );

  onCleanup(() => {
    const app = $globalRenderer.get();
    if (viewport) {
      app.stage.removeChild(viewport);
      viewport.removeAllListeners();
      viewport.destroy({
        children: true,
      });
    }
    container.children.length > 0 && container.removeChild(app.canvas);
  });

  createEffect(async () => {
    const data = characterData();
    if (isInit() && data) {
      await ch.update({...data, instruction: 'braveslash4'});
    }
  });

  createEffect(async () => {
    if (!(isInit() && viewport)) {
      return;
    }
    if (isShowUpscale()) {
      /* to be configurable in the future */
      const upscalePipelines = [
        {
          pipeline: PipelineType.ModeBB,
        },
      ] as PipelineOption[];

      if (!upscaleFilter) {
        const app = $globalRenderer.get();
        if (!app.renderer.anime4k) {
          // currently only support WebGPU
          return;
        }
        await app.renderer.anime4k.preparePipeline(
          upscalePipelines.map((p) => p.pipeline),
        );
        upscaleFilter = new Anime4kFilter(upscalePipelines);
      }
      // upscaleFilter.updatePipeine(upscalePipelines);
      viewport.filters = [upscaleFilter];
    } else {
      viewport.filters = [];
    }
  });

  createEffect(() => {
    const info = zoomInfo();
    const scaled = info.zoom;
    const center = info.center;
    /* only sync when target is not self */
    if (viewport && $zoomTarget.get() !== props.target) {
      viewport.scaled = scaled;
      viewport.moveCenter(center);
    }
  });

  return <div ref={container} />;
};
