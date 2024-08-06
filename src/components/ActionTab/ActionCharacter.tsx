import { createSignal, createEffect, onMount, onCleanup, from } from 'solid-js';

import { $previewCharacter } from '@/store/character/selector';

import type { Application } from 'pixi.js';
import { Character } from '@/renderer/character/character';

import {
  characterToCanvasFrames,
  type CanvasFramesData,
} from '@/renderer/character/characterToCanvasFrames';
import { characterLoadingQueue } from '@/utils/characterLoadingQueue';

import { isDoubleHandAction, type CharacterAction } from '@/const/actions';
import { CharacterHandType } from '@/const/hand';

export interface ActionCharacterRef {
  character: Character;
  makeCharacterFrames: () => Promise<CanvasFramesData>;
}
export interface ActionCharacterProps {
  action: CharacterAction;
  ref: (element: ActionCharacterRef) => void;
  mainApp: Application;
  position: { x: number; y: number };
}
export const ActionCharacter = (props: ActionCharacterProps) => {
  const characterData = from($previewCharacter);
  const [isInit, setIsInit] = createSignal(false);

  let abortController: AbortController | undefined = undefined;
  const canvasFrameCache: { current?: CanvasFramesData } = {};
  const character = new Character();

  function makeCharacterFrames() {
    if (canvasFrameCache.current) {
      return Promise.resolve(canvasFrameCache.current);
    }
    return characterToCanvasFrames(character, props.mainApp.renderer);
  }

  props.ref({ character, makeCharacterFrames });

  createEffect(() => {
    if (props.position) {
      character.position.copyFrom(props.position);
    }
  });

  createEffect(async () => {
    canvasFrameCache.current = undefined;
    const data = characterData();
    const action = props.action;
    const handType = isDoubleHandAction(props.action)
      ? CharacterHandType.DoubleHand
      : CharacterHandType.SingleHand;
    if (isInit() && data) {
      abortController?.abort();
      abortController = new AbortController();
      try {
        await characterLoadingQueue.add(
          () => character.update({ ...data, action, handType }),
          { signal: abortController.signal },
        );
      } catch (e) {
        if (!(e instanceof DOMException && e.name === 'AbortError')) {
          console.error('Character update error', e);
        }
      }
    }
  });

  onMount(() => {
    props.mainApp.stage.addChild(character);
    setIsInit(true);
  });

  onCleanup(() => {
    character.reset();
  });

  return null;
};
