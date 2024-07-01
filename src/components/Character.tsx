import {
  onMount,
  onCleanup,
  createEffect,
  createSignal,
  For,
  Show,
} from 'solid-js';

import { css } from 'styled-system/css';

import { $previewCharacter } from '@/store/character';
import { usePureStore } from '@/store';

import { Application, Container } from 'pixi.js';
import { Character } from '@/renderer/character/character';
import { CharacterLoader } from '@/renderer/character/loader';

import LoaderCircle from 'lucide-solid/icons/loader-circle';

import { CharacterAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterEarType } from '@/const/ears';
import { CharacterHandType } from '@/const/hand';

interface SelectionProps<T extends string> {
  label: string;
  values: T[];
  onChange: (value: T) => void;
}
const Selection = <T extends string>(props: SelectionProps<T>) => {
  return (
    <label for={props.label}>
      {props.label}:
      <select onChange={(e) => props.onChange(e.target.value as T)}>
        <For each={props.values}>
          {(value) => <option value={value}>{value}</option>}
        </For>
      </select>
    </label>
  );
};

export const CharacterScene = () => {
  const characterData = usePureStore($previewCharacter);
  const [isLoading, setIsLoading] = createSignal(false);
  let container!: HTMLDivElement;
  const app = new Application();
  const ch = new Character(app);

  ch.loadEvent.addListener('loading', () => setIsLoading(true));
  ch.loadEvent.addListener('loaded', () => setIsLoading(false));

  async function initScene() {
    await CharacterLoader.init();
    await app.init({
      width: 300,
      height: 300,
      background: 0x000000,
      backgroundAlpha: 1,
      useBackBuffer: true,
    });
    container?.appendChild(app.canvas);
    const characterLayer = new Container();
    characterLayer.addChild(ch);
    characterLayer.position.set(150, 150);
    app.stage.addChild(characterLayer);

    ch.updateItems(Object.values(characterData().items));
    await ch.loadItems();
    // ch.render();
  }

  onMount(() => {
    initScene();
  });

  onCleanup(() => {
    ch.reset();
  });

  createEffect(() => {
    ch.updateItems(Object.values(characterData().items));
  });

  function updateAction(action: CharacterAction) {
    ch.action = action;
  }
  function updateExpression(expression: CharacterExpressions) {
    ch.expression = expression;
  }
  function updateEarType(earType: CharacterEarType) {
    ch.earType = earType;
  }
  function updateHandType(handType: CharacterHandType) {
    ch.handType = handType;
  }

  return (
    <div class={css({ position: 'relative' })}>
      <Selection
        label="Action"
        values={Object.values(CharacterAction)}
        onChange={updateAction}
      />
      <Selection
        label="Expression"
        values={Object.values(CharacterExpressions)}
        onChange={updateExpression}
      />
      <Selection
        label="Ear Type"
        values={Object.values(CharacterEarType)}
        onChange={updateEarType}
      />
      <Selection
        label="Hand Type"
        values={Object.values(CharacterHandType)}
        onChange={updateHandType}
      />
      <div class="alpha-bg" ref={container} />
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
