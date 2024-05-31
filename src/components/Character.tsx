import { useStore } from '@nanostores/solid';
import { onMount, onCleanup, createEffect } from 'solid-js';

import { $currentCharacter } from '@/store/character';

import { Application } from 'pixi.js';
import { Character } from '@/renderer/character/character';
import { CharacterLoader } from '@/renderer/character/loader';

export const CharacterScene = () => {
  const characterData = useStore($currentCharacter);
  let container!: HTMLDivElement;
  const app = new Application();
  const ch = new Character();

  async function initScene() {
    await CharacterLoader.init();
    await app.init({
      width: 300,
      height: 300,
      background: 0x00000000,
      backgroundAlpha: 0,
    });
    container?.appendChild(app.canvas);
    app.stage.addChild(ch);
    ch.updateItems(characterData().items);
    await ch.loadItems();
    ch.render();
    ch.position.set(150, 150);
  }

  onMount(() => {
    initScene();
  });

  onCleanup(() => {
    ch.reset();
  });

  createEffect(() => {
    ch.updateItems(characterData().items);
  });

  return <div ref={container} />;
};
