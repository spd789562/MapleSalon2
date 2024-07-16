import { onMount, onCleanup, createEffect, createSignal } from 'solid-js';
import type { ReadableAtom } from 'nanostores';

import type { CharacterData } from '@/store/character';
import { usePureStore } from '@/store';

import { Application, Container } from 'pixi.js';
import { Character } from '@/renderer/character/character';

export interface CharacterViewProps {
  onLoad: () => void;
  onLoaded: () => void;
  store: ReadableAtom<CharacterData>;
}
export const CharacterView = (props: CharacterViewProps) => {
  const characterData = usePureStore(props.store);
  const [isInit, setIsInit] = createSignal<boolean>(false);
  let container!: HTMLDivElement;
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
    container.appendChild(app.canvas);
    const characterLayer = new Container();
    characterLayer.addChild(ch);
    characterLayer.position.set(150, 150);
    app.stage.addChild(characterLayer);

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
