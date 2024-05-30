import { useStore } from '@nanostores/solid';
import { onMount, createEffect } from 'solid-js';

import { $currentCharacter } from '@/store/character';

import { Application } from 'pixi.js';
import { Character } from '@/renderer/character/character';

export const CharacterScene = () => {
  const characterData = useStore($currentCharacter);
  let container: HTMLDivElement;
  const app = new Application();
  const ch = new Character();

  async function initScene() {
    await app.init({ width: 300, height: 300 });
    container?.appendChild(app.canvas);
    app.stage.addChild(ch);
  }

  onMount(() => {
    initScene();
  });

  createEffect(() => {
    ch.updateItems(characterData().items);
  });

  /* @ts-ignore */
  return <div ref={container} />;
};
