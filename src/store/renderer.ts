import { atom } from 'nanostores';
import { Application } from 'pixi.js';

import { CharacterLoader } from '@/renderer/character/loader';

export const $globalRenderer = atom<Application>(new Application());

export const $isGlobalRendererInitialized = atom<boolean>(false);

export async function initialGlobalRenderer() {
  const app = $globalRenderer.get();
  await CharacterLoader.init();
  await app.init({
    width: 300,
    height: 300,
    backgroundAlpha: 0,
    useBackBuffer: true,
  });
  $isGlobalRendererInitialized.set(true);
}
