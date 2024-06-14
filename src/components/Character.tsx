import { useStore } from '@nanostores/solid';
import { onMount, onCleanup, createEffect, For, createSignal } from 'solid-js';

import type { SliderValueChangeDetails } from '@ark-ui/solid';
import { Flex } from 'styled-system/jsx';
import { Slider as UiSlider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

import { $currentCharacter } from '@/store/character';
import type { ItemInfo } from '@/renderer/character/const/data';

import { Application, Container } from 'pixi.js';
import { Character } from '@/renderer/character/character';
import { CharacterLoader } from '@/renderer/character/loader';

import { CharacterAction } from '@/const/actions';
import { CharacterExpressions } from '@/const/emotions';
import { CharacterEarType } from '@/const/ears';
import { CharacterHandType } from '@/const/hand';
import { getIconPath } from '@/utils/itemId';

function updateCurrentCharacterDyeable(
  character: Character,
  field: keyof ItemInfo,
  value: number,
) {
  const dyeableIds = $currentCharacter
    .get()
    .items.map((item, index) => (item[field] !== undefined ? index : -1))
    .filter((item) => item !== -1);

  for (const index of dyeableIds) {
    const id = $currentCharacter.get().items[index].id;
    $currentCharacter.setKey(`items[${index}].${field}`, value);
    const info = $currentCharacter.get().items[index];
    character.updateFilter(id, info);
  }
}

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

interface SliderProps<T extends number> {
  label: string;
  min: number;
  max: number;
  step: number;
  onChange: (value: T) => void;
  initialValue?: T;
}
const Slider = <T extends number>(props: SliderProps<T>) => {
  const [value, setValue] = createSignal(props.initialValue ?? 0);

  function updateValue(newValue: number) {
    setValue(newValue);
    props.onChange(newValue as T);
  }

  function handleInput(value: SliderValueChangeDetails) {
    updateValue(value.value[0]);
  }

  function resetValue() {
    updateValue(0);
  }

  return (
    <Flex style={{ 'max-width': '300px' }}>
      <UiSlider
        value={[value()]}
        min={props.min}
        max={props.max}
        onValueChange={handleInput}
        marks={[
          { value: props.min, label: props.min.toString() },
          { value: props.max, label: props.max.toString() },
        ]}
      >
        {props.label}({value()})
      </UiSlider>
      <Button type="reset" size="sm" variant="subtle" onClick={resetValue}>
        Reset
      </Button>
    </Flex>
  );
};

export const CharacterScene = () => {
  const characterData = useStore($currentCharacter);
  let container!: HTMLDivElement;
  const app = new Application();
  const ch = new Character(app);

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

  function updateHue(hue: number) {
    updateCurrentCharacterDyeable(ch, 'hue', hue);
  }
  function updateSaturation(saturation: number) {
    updateCurrentCharacterDyeable(ch, 'saturation', saturation);
  }
  function updateLightness(lightness: number) {
    updateCurrentCharacterDyeable(ch, 'brightness', lightness);
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
      <Slider label="Hue" min={0} max={360} step={1} onChange={updateHue} />
      <Slider
        label="Saturation"
        min={-100}
        max={100}
        step={1}
        onChange={updateSaturation}
      />
      <Slider
        label="Lightness"
        min={-100}
        max={100}
        step={1}
        onChange={updateLightness}
      />
      <div class="alpha-bg" ref={container} />
      <For each={characterData().items}>
        {(item) => <img src={getIconPath(item.id)} alt={item.id.toString()} />}
      </For>
    </div>
  );
};
