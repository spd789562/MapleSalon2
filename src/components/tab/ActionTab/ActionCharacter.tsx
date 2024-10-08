import { createSignal, createEffect, onMount, onCleanup, from } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $previewCharacter } from '@/store/character/selector';
import { $actionExportHandType } from '@/store/toolTab';

import type { Application } from 'pixi.js';
import { Character } from '@/renderer/character/character';

import {
  characterToCanvasFrames,
  type CanvasFramesData,
} from '@/renderer/character/characterToCanvasFrames';
import { characterLoadingQueue } from '@/utils/characterLoadingQueue';

import {
  isValidAction,
  isDoubleHandAction,
  type CharacterSpecialAction,
  type CharacterAction,
} from '@/const/actions';
import { CharacterHandType } from '@/const/hand';

export interface ActionCharacterRef {
  character: Character;
  makeCharacterFrames: (padWhiteSpace?: boolean) => Promise<CanvasFramesData>;
}
export interface ActionCharacterProps {
  action: CharacterAction | CharacterSpecialAction;
  ref: (element: ActionCharacterRef) => void;
  mainApp: Application;
  position: { x: number; y: number };
}
export const ActionCharacter = (props: ActionCharacterProps) => {
  const characterData = from($previewCharacter);
  const exportHandType = useStore($actionExportHandType);
  const [isInit, setIsInit] = createSignal(false);

  let abortController: AbortController | undefined;
  const canvasFrameCache: { current?: CanvasFramesData } = {};
  const character = new Character();

  function makeCharacterFrames(padWhiteSpace?: boolean) {
    if (canvasFrameCache.current) {
      return Promise.resolve(canvasFrameCache.current);
    }
    return characterToCanvasFrames(character, props.mainApp.renderer, {
      padWhiteSpace,
    });
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
    const action = props.action as CharacterAction;
    const instruction = isValidAction(action) ? undefined : props.action;
    const handType =
      exportHandType() === CharacterHandType.Gun
        ? CharacterHandType.Gun
        : isDoubleHandAction(action)
          ? CharacterHandType.DoubleHand
          : CharacterHandType.SingleHand;
    if (isInit() && data) {
      abortController?.abort();
      abortController = new AbortController();
      try {
        await characterLoadingQueue.add(
          () => character.update({ ...data, action, instruction, handType }),
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
    props.mainApp.stage.removeChild(character);
    character.destroy({ children: true });
  });

  return null;
};
