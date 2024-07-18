import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import type { ReadableAtom } from 'nanostores';

import type { CharacterData } from '@/store/character/store';
import { usePureStore } from '@/store';

import { Application, Container } from 'pixi.js';
import { Character } from '@/renderer/character/character';
import { ZoomContainer } from '@/renderer/ZoomContainer';

export interface CharacterViewProps {
  onLoad: () => void;
  onLoaded: () => void;
  store: ReadableAtom<CharacterData>;
}
export const CharacterView = (props: CharacterViewProps) => {
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

  return <div ref={container} />;
};
