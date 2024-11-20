import { onMount, onCleanup, createEffect, createSignal, from } from 'solid-js';
import type { ReadableAtom } from 'nanostores';

import { $preferRenderer } from '@/store/renderer';
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
import { useChatBalloonText } from './useChatBalloonText';

import { Application } from 'pixi.js';
import { Character } from '@/renderer/character/character';
import { ZoomContainer } from '@/renderer/ZoomContainer';
import { Anime4kFilter } from '@/renderer/filter/anime4k/Anime4kFilter';
import {
  PipelineType,
  type PipelineOption,
} from '@/renderer/filter/anime4k/const';

export interface CharacterViewProps {
  onLoad: () => void;
  onLoaded: () => void;
  store: ReadableAtom<CharacterData>;
  target: string;
}
export const CharacterView = (props: CharacterViewProps) => {
  const zoomInfo = usePureStore($previewZoomInfo);
  const characterData = from(props.store);
  const [isInit, setIsInit] = createSignal<boolean>(false);
  const isShowUpscale = usePureStore($showUpscaledCharacter);
  let container!: HTMLDivElement;
  let viewport: ZoomContainer | undefined;
  let upscaleFilter: Anime4kFilter | undefined;
  const app = new Application();
  const ch = new Character();
  useChatBalloonText(ch);

  ch.loadEvent.addListener('loading', props.onLoad);
  ch.loadEvent.addListener('loaded', props.onLoaded);

  async function initScene() {
    await app.init({
      width: 300,
      height: 340,
      background: 0x000000,
      backgroundAlpha: 0,
      // antialias: true,
      preference: $preferRenderer.get(),
    });
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
        viewport.scaled >= MIN_ZOOM
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

  onMount(() => {
    initScene();
  });

  onCleanup(() => {
    app.destroy(undefined, {
      children: true,
    });
  });

  createEffect(async () => {
    const data = characterData();
    if (isInit() && data) {
      await ch.update(data);
    }
  });

  createEffect(async () => {
    if (isInit() && viewport) {
      if (isShowUpscale()) {
        /* to be configurable in the future */
        const upscalePipelines = [
          {
            pipeline: PipelineType.ModeBB,
          },
        ] as PipelineOption[];

        if (!upscaleFilter) {
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
