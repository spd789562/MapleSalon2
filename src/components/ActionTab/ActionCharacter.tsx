import { createSignal, createEffect, onMount, onCleanup, from } from 'solid-js';

import { $previewCharacter } from '@/store/character/selector';

import { Application } from 'pixi.js';
import { Character } from '@/renderer/character/character';

import {
  characterToCanvasFrames,
  type CanvasFramesData,
} from '@/renderer/character/characterToCanvasFrames';

import type { CharacterAction } from '@/const/actions';

export interface ActionCharacterRef {
  character: Character;
  makeCharacterFrames: () => Promise<CanvasFramesData>;
}
export interface ActionCharacterProps {
  action: CharacterAction;
  ref: (element: ActionCharacterRef) => void;
}
export const ActionCharacter = (props: ActionCharacterProps) => {
  const characterData = from($previewCharacter);
  const [isInit, setIsInit] = createSignal(false);

  let container!: HTMLDivElement;
  const canvasFrameCache: { current?: CanvasFramesData } = {};
  const app = new Application();
  const character = new Character();

  function makeCharacterFrames() {
    if (canvasFrameCache.current) {
      return Promise.resolve(canvasFrameCache.current);
    }
    return characterToCanvasFrames(character, app.renderer);
  }

  props.ref({ character, makeCharacterFrames });

  createEffect(() => {
    canvasFrameCache.current = undefined;
    const data = characterData();
    const action = props.action;
    if (isInit() && data) {
      character.update({ ...data, action });
    }
  });

  onMount(async () => {
    await app.init({
      width: 300,
      height: 300,
      background: 0x000000,
      backgroundAlpha: 0,
      antialias: true,
    });

    container.appendChild(app.canvas);
    app.stage.addChild(character);
    character.position.set(150, 150);

    setIsInit(true);
  });

  onCleanup(() => {
    character.reset();
  });

  return <div ref={container} />;
};
