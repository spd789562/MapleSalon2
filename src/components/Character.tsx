import { useStore } from '@nanostores/solid';
import { onMount, onCleanup, createEffect, For } from 'solid-js';

import { $currentCharacter } from '@/store/character';

import { Application, Container } from 'pixi.js';
import { Character } from '@/renderer/character/character';
import { CharacterLoader } from '@/renderer/character/loader';

import { CharacterAction } from '@/renderer/character/const/actions';
import { CharacterExpressions } from '@/renderer/character/const/emotions';
import { CharacterEarType } from '@/renderer/character/const/ears';
import { CharacterHandType } from '@/renderer/character/const/hand';

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
  const characterData = useStore($currentCharacter);
  let container!: HTMLDivElement;
  const app = new Application();
  const ch = new Character();

  async function initScene() {
    await CharacterLoader.init();
    await app.init({
      width: 300,
      height: 300,
      background: 0x000000,
      backgroundAlpha: 1,
    });
    container?.appendChild(app.canvas);
    const characterLayer = new Container();
    characterLayer.addChild(ch);
    characterLayer.position.set(150, 150);
    app.stage.addChild(characterLayer);

    ch.updateItems(characterData().items);
    await ch.loadItems();
    ch.render();
  }

  onMount(() => {
    initScene();
  });

  onCleanup(() => {
    ch.reset();
  });

  createEffect(() => {
    ch.updateItems(characterData().items);
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
    <div>
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
      <div ref={container} />
    </div>
  );
};
