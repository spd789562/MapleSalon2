import { GlTextureSystem } from 'pixi.js';
import { createEffect, createMemo, createSignal, Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import {
  $isGlobalRendererInitialized,
  $globalRenderer,
  $simpleCharacterCache,
} from '@/store/renderer';
import type { CharacterItems, CharacterInfo } from '@/store/character/store';
import { getUpdateItems } from '@/store/character/utils';

import { Skeleton } from './ui/skeleton';

import { Character } from '@/renderer/character/character';

import { makeCharacterHash } from '@/utils/characterHash';
import { webGLGenerateCanvas } from '@/utils/webGLExtract';

import { CharacterAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterHandType } from '@/const/hand';
import { CharacterEarType } from '@/const/ears';

export interface SimpleCharacterProps extends Partial<CharacterInfo> {
  title: string;
  items: Partial<CharacterItems>;
  itemsOverride?: Partial<CharacterItems>;
  /** remove default maxWidth: 100% css style */
  noMaxWidth?: boolean;
  /** apply offset on character, useful when need to use same offset on character */
  useOffset?: boolean;
  /** ref to image */
  ref?: HTMLImageElement;
}
export const SimpleCharacter = (props: SimpleCharacterProps) => {
  const isInit = useStore($isGlobalRendererInitialized);
  const [url, setUrl] = createSignal<string>('');
  /* [x, y] */
  const [offset, setOffset] = createSignal<[number, number]>([0, 0]);

  const maxWidthStyle = props.noMaxWidth ? { 'max-width': 'unset' } : {};

  const totalItems = createMemo(() =>
    props.itemsOverride
      ? getUpdateItems(props.items, props.itemsOverride || {})
      : props.items,
  );

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
        items: totalItems(),
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
          const offsetBounds = character.getLocalBounds();
          const imageCenter = {
            x: offsetBounds.width / 2,
            y: offsetBounds.height / 2,
          };
          const bellyPos = {
            x: -offsetBounds.x,
            y: -offsetBounds.y,
          };
          const calcOffset = {
            x: Math.floor(imageCenter.x - bellyPos.x) - 4,
            y: Math.floor(imageCenter.y - bellyPos.y) + 10,
          };
          /* prevent pixi's error */
          character.effects = [];
          const texture = app.renderer.extract.texture(character);

          const canvas = (() => {
            if (app.renderer.texture instanceof GlTextureSystem) {
              // the webgl currently doesn't support unpremultiplyAlpha, so do it manually
              return webGLGenerateCanvas(texture, app.renderer.texture);
            }
            return app.renderer.texture.generateCanvas(texture);
          })();

          const url = await new Promise<string>((resolve) => {
            canvas.toBlob?.((blob) => {
              if (blob) {
                return resolve(URL.createObjectURL(blob));
              }
              return resolve('');
            }, 'image/png');
          });

          if (url) {
            if (props.useOffset) {
              setOffset([calcOffset.x, calcOffset.y]);
            }
            $simpleCharacterCache.setKey(
              hash,
              `${url}?x=${calcOffset.x}&y=${calcOffset.y}`,
            );
            setUrl(url);
          }
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
        ref={props.ref}
      />
    </Show>
  );
};
