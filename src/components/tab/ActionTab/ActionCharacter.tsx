import { createSignal, createEffect, onMount, onCleanup, from } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $previewCharacter } from '@/store/character/selector';
import { $actionExportHandType, $forceExportEffect } from '@/store/toolTab';

import type { Application } from 'pixi.js';
import { Character } from '@/renderer/character/character';

import {
  characterToCanvasFrames,
  characterToCanvasFramesWithEffects,
  type CanvasFramesData,
} from '@/renderer/character/characterToCanvasFrames';
import { characterLoadingQueue } from '@/utils/characterLoadingQueue';

import {
  isValidAction,
  isDoubleHandAction,
  CharacterAction,
  type CharacterSpecialAction,
} from '@/const/actions';
import { CharacterHandType } from '@/const/hand';

export interface ActionCharacterRef {
  character: Character;
  makeCharacterFrames: (options?: {
    padWhiteSpace?: boolean;
    backgroundColor?: string;
  }) => Promise<CanvasFramesData>;
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

  function makeCharacterFrames(options?: {
    padWhiteSpace?: boolean;
    backgroundColor?: string;
  }) {
    if (canvasFrameCache.current) {
      return Promise.resolve(canvasFrameCache.current);
    }
    const params = [
      character,
      props.mainApp.renderer,
      {
        backgroundColor: options?.backgroundColor,
        padWhiteSpace: options?.padWhiteSpace,
      },
    ] as const;
    if ($forceExportEffect.get()) {
      return characterToCanvasFramesWithEffects(...params);
    }
    return characterToCanvasFrames(...params);
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
    let action = props.action as CharacterAction;
    const instruction = isValidAction(props.action as CharacterAction)
      ? undefined
      : props.action;
    if (instruction) {
      action = CharacterAction.Stand1;
    }
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
