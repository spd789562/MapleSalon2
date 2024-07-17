import { createEffect, createSignal, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import {
  $isGlobalRendererInitialized,
  $globalRenderer,
  $simpleCharacterCache,
} from '@/store/renderer';
import type { CharacterItems, CharacterInfo } from '@/store/character/store';

import { Skeleton } from './ui/skeleton';

import { Character } from '@/renderer/character/character';

import { makeCharacterHash } from '@/utils/characterHash';

import { CharacterAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterHandType } from '@/const/hand';
import { CharacterEarType } from '@/const/ears';

export interface SimpleCharacterProps extends Partial<CharacterInfo> {
  title: string;
  items: Partial<CharacterItems>;
  noMaxWidth?: boolean;
}
export const SimpleCharacter = (props: SimpleCharacterProps) => {
  const isInit = useStore($isGlobalRendererInitialized);
  const [url, setUrl] = createSignal<string>('');

  const style = props.noMaxWidth ? { 'max-width': 'unset' } : {};

  createEffect(async () => {
    if (isInit()) {
      const app = $globalRenderer.get();
      const characterData = {
        frame: props.frame || 0,
        isAnimating: !!props.isAnimating,
        action: props.action || CharacterAction.Stand1,
        expression: props.expression || CharacterExpressions.Default,
        earType: props.earType || CharacterEarType.HumanEar,
        handType: props.handType || CharacterHandType.SingleHand,
        items: props.items,
      };
      const hash = makeCharacterHash(characterData);
      const existCache: string | undefined = $simpleCharacterCache.get()[hash];
      if (existCache) {
        setUrl(existCache);
      } else {
        const character = new Character();
        if (app.renderer?.extract) {
          await character.update(characterData);
          /* prevent pixi's error */
          character.effects = [];
          const canvas = app.renderer.extract.canvas(character);
          canvas.toBlob?.((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              $simpleCharacterCache.setKey(hash, url);
              setUrl(url);
            }
          });
          character.reset();
          character.loadEvent.removeAllListeners();
          character.destroy();
        }
      }
    }
  });

  return (
    <Show when={url()} fallback={<Skeleton width="3.5rem" height="5rem" />}>
      <img src={url()} alt={props.title} style={style} />
    </Show>
  );
};
