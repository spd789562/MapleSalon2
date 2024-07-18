import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import type { ReadableAtom } from 'nanostores';

import type { CharacterData } from '@/store/character/store';
import {
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
      height: 260,
      background: 0x000000,
      backgroundAlpha: 0,
    });
    viewport = new ZoomContainer(app, {
      width: 300,
      height: 260,
      worldScale: 2,
      maxScale: 3,
    });
    viewport.on('zoomed', () => {
      if (viewport && viewport.scaled <= 3) {
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
    // const characterLayer = new Container();
    viewport.addChild(ch);
    // characterLayer.position.set(150, 150);
    app.stage.addChild(viewport);

    setIsInit(true);
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

  return <div ref={container} />;
};
