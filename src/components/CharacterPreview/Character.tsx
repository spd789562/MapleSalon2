import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import type { ReadableAtom } from 'nanostores';

import type { CharacterData } from '@/store/character/store';
import {
  MAX_ZOOM,
  MIN_ZOOM,
  $zoomTarget,
  $previewZoomInfo,
  updateCenter,
  updateZoom,
} from '@/store/previewZoom';
import { usePureStore } from '@/store';

import { Application } from 'pixi.js';
import { Character } from '@/renderer/character/character';
import { ZoomContainer } from '@/renderer/ZoomContainer';

export interface CharacterViewProps {
  onLoad: () => void;
  onLoaded: () => void;
  store: ReadableAtom<CharacterData>;
  target: string;
}
export const CharacterView = (props: CharacterViewProps) => {
  const zoomInfo = usePureStore($previewZoomInfo);
  const characterData = usePureStore(props.store);
  const [isInit, setIsInit] = createSignal<boolean>(false);
  let container!: HTMLDivElement;
  let viewport: ZoomContainer | undefined = undefined;
  const app = new Application();
  const ch = new Character(app);

  ch.loadEvent.addListener('loading', props.onLoad);
  ch.loadEvent.addListener('loaded', props.onLoaded);

  async function initScene() {
    await app.init({
      width: 300,
      height: 340,
      background: 0x000000,
      backgroundAlpha: 0,
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
        updateZoom(viewport.scaled, props.target);
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

  function handlePreventScrollBubble(e: Event) {
    e.preventDefault();
  }

  onMount(() => {
    initScene();
  });

  onCleanup(() => {
    ch.reset();
  });

  createEffect(async () => {
    if (isInit()) {
      await ch.update(characterData());
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

  return <div ref={container} onWheel={handlePreventScrollBubble} />;
};
