import { onMount, onCleanup, createEffect, createSignal, Show } from 'solid-js';

import { css } from 'styled-system/css';

import { $previewCharacter } from '@/store/character/selector';
import { usePureStore } from '@/store';

import { Application, Container } from 'pixi.js';
import { Character } from '@/renderer/character/character';

import LoaderCircle from 'lucide-solid/icons/loader-circle';

export const CharacterAvatar = () => {
  const characterData = usePureStore($previewCharacter);
  const [isInit, setIsInit] = createSignal<boolean>(false);
  const [isLoading, setIsLoading] = createSignal(false);
  let container!: HTMLDivElement;
  const app = new Application();
  const ch = new Character(app);

  ch.loadEvent.addListener('loading', () => setIsLoading(true));
  ch.loadEvent.addListener('loaded', () => setIsLoading(false));

  async function initScene() {
    await app.init({
      width: 300,
      height: 260,
      background: 0x000000,
      backgroundAlpha: 0,
    });
    container.appendChild(app.canvas);
    const characterLayer = new Container();
    characterLayer.addChild(ch);
    characterLayer.position.set(150, 150);
    app.stage.addChild(characterLayer);

    setIsInit(true);
  }

  onMount(() => {
    initScene();
  });

  onCleanup(() => {
    ch.reset();
  });

  createEffect(async () => {
    if (isInit()) {
      await ch.update(characterData());
    }
  });

  return (
    <div class={css({ position: 'relative' })}>
      <div ref={container} />
      <Show when={isLoading()}>
        <div
          class={css({
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'bg.muted',
            opacity: 0.75,
          })}
        >
          <div
            class={css({
              animation: 'rotate infinite 1s linear',
              color: 'fg.muted',
            })}
          >
            <LoaderCircle size="48px" />
          </div>
        </div>
      </Show>
    </div>
  );
};
