import {
  createEffect,
  createMemo,
  createSignal,
  Show,
  untrack,
  onCleanup,
} from 'solid-js';
import type { Renderer } from 'pixi.js';
import { useStore } from '@nanostores/solid';

import {
  $isGlobalRendererInitialized,
  $globalRenderer,
  $simpleCharacterCache,
} from '@/store/renderer';
import type {
  CharacterItems,
  CharacterInfo,
  CharacterData,
} from '@/store/character/store';
import { getUpdateItems } from '@/store/character/utils';
import {
  setItemContextMenuTargetInfo,
  type ItemContextMenuTargetInfo,
} from '@/store/itemContextMenu';

import { Skeleton } from './ui/skeleton';

import { Character } from '@/renderer/character/character';

import { useItemContextTrigger } from '@/context/itemContextMenu';

import { makeCharacterHash } from '@/utils/characterHash';
import { extractCanvas } from '@/utils/extract';
import { simpleCharacterLoadingQueue } from '@/utils/characterLoadingQueue';

import { CharacterAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterHandType } from '@/const/hand';
import { CharacterEarType } from '@/const/ears';
import { nextTick } from '@/utils/eventLoop';

export interface SimpleCharacterProps extends Partial<CharacterInfo> {
  title: string;
  items: Partial<CharacterItems>;
  itemsOverride?: Partial<CharacterItems>;
  /** remove default maxWidth: 100% css style */
  noMaxWidth?: boolean;
  /** apply offset on character, useful when need to use same offset on character */
  useOffset?: boolean;
  /** ref to image */
  ref?: (element: HTMLImageElement) => void;
  itemContext?: Omit<ItemContextMenuTargetInfo, 'icon'>;
}
export const SimpleCharacter = (props: SimpleCharacterProps) => {
  let abortController: AbortController | undefined;
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

  async function makeCharacterImage(
    renderer: Renderer,
    hash: string,
    characterData: CharacterData,
  ) {
    const character = new Character();
    if (renderer?.extract) {
      await character.update(characterData);
      await nextTick();
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
        x: Math.floor(imageCenter.x - bellyPos.x) + 4,
        y: Math.floor(imageCenter.y - bellyPos.y) + 30,
      };
      /* prevent pixi's error */
      character.effects = [];

      const canvas = extractCanvas(character, renderer);

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
      await nextTick();
      character.reset();
      character.loadEvent.removeAllListeners();
      character.destroy();
    }
  }

  createEffect(() => {
    if (!props.useOffset) {
      setOffset([0, 0]);
    }
  });

  createEffect(async () => {
    if (isInit()) {
      const app = $globalRenderer.get();
      const characterData = {
        name: props.name,
        frame: props.frame || 0,
        isAnimating: !!props.isAnimating,
        action: props.action || CharacterAction.Stand1,
        expression: props.expression || CharacterExpressions.Default,
        earType: props.earType || CharacterEarType.HumanEar,
        handType: props.handType || CharacterHandType.SingleHand,
        nameTagId: props.nameTagId,
        showNameTag: !!props.showNameTag,
        showChatBalloon: !!props.showChatBalloon,
        medalId: props.medalId,
        nickTagId: props.nickTagId,
        items: totalItems(),
      };
      const hash = makeCharacterHash(characterData);

      const existCache: string | undefined = $simpleCharacterCache.get()[hash];
      if (existCache) {
        const [url, query] = existCache.split('?');
        setUrl(url);
        if (untrack(() => props.useOffset)) {
          const searchParams = new URLSearchParams(query);
          const x = Number.parseInt(searchParams.get('x') || '0', 10);
          const y = Number.parseInt(searchParams.get('y') || '0', 10);
          setOffset([x, y]);
        }
      } else {
        setUrl('');
        if (!app.renderer?.extract) {
          return;
        }
        abortController = new AbortController();
        try {
          await simpleCharacterLoadingQueue.add(
            () => makeCharacterImage(app.renderer, hash, characterData),
            { signal: abortController.signal },
          );
        } catch (e) {
          if (e instanceof DOMException && e.name === 'AbortError') {
            return;
          }
          console.error('simple character render error', e);
        }
      }
    }
  });

  onCleanup(() => {
    abortController?.abort();
  });

  const contextTriggerProps = useItemContextTrigger();

  function handleContextMenu(event: MouseEvent) {
    if (props.itemContext && url()) {
      setItemContextMenuTargetInfo({
        id: props.itemContext.id,
        name: props.itemContext.name || props.itemContext.id.toString(),
        icon: url(),
      });
      const cb = contextTriggerProps.onContextMenu as unknown as (
        event: MouseEvent,
      ) => void;
      cb?.(event);
    }
  }

  return (
    <Show when={url()} fallback={<Skeleton width="3.5rem" height="5rem" />}>
      <img
        src={url()}
        alt={props.title}
        style={{
          ...maxWidthStyle,
          transform: `translate(${offset()[0]}px, ${offset()[1]}px)`,
        }}
        onContextMenu={handleContextMenu}
        ref={props.ref}
      />
    </Show>
  );
};
