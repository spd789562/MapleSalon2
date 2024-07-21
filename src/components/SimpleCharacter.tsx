import { createEffect, createSignal, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { Point } from 'pixi.js';

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
  useOffset?: boolean;
}
export const SimpleCharacter = (props: SimpleCharacterProps) => {
  const isInit = useStore($isGlobalRendererInitialized);
  const [url, setUrl] = createSignal<string>('');
  /* [x, y] */
  const [offset, setOffset] = createSignal<[number, number]>([0, 0]);

  const maxWidthStyle = props.noMaxWidth ? { 'max-width': 'unset' } : {};

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
        const [url, query] = existCache.split('?');
        setUrl(url);
        if (props.useOffset) {
          const searchParams = new URLSearchParams(query);
          const x = Number.parseInt(searchParams.get('x') || '0', 10);
          const y = Number.parseInt(searchParams.get('y') || '0', 10);
          setOffset([x, y]);
        }
      } else {
        const character = new Character();
        if (app.renderer?.extract) {
          await character.update(characterData);
          const feetCenter = character.pivot;
          const offsetBounds = character.getLocalBounds();
          const imageCenter = {
            x: offsetBounds.width / 2,
            y: offsetBounds.height / 2,
          };
          const calcOffset = {
            x: Math.floor(imageCenter.x / 2 - feetCenter.x),
            y: Math.floor(imageCenter.y - feetCenter.y - 10),
          };
          /* prevent pixi's error */
          character.effects = [];
          const canvas = app.renderer.extract.canvas(character);
          canvas.toBlob?.((blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              $simpleCharacterCache.setKey(
                hash,
                `${url}?x=${calcOffset.x}&y=${-calcOffset.y}`,
              );
              setUrl(url);
              if (props.useOffset) {
                setOffset([calcOffset.x, -calcOffset.y]);
              }
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
      <img
        src={url()}
        alt={props.title}
        style={{
          ...maxWidthStyle,
          transform: `translate(${offset()[0]}px, ${offset()[1]}px)`,
        }}
      />
    </Show>
  );
};
