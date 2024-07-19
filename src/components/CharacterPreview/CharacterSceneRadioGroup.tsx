import { Index } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { css } from 'styled-system/css';

import { $currentScene } from '@/store/character/store';
import { HStack } from 'styled-system/jsx/hstack';
import * as RadioButtonGroup from '@/components/ui/radioButtonGroup';

import {
  PreviewScene,
  PreviewSceneNames,
  PreviewSceneBackground,
} from '@/const/scene';

const options = [
  {
    value: PreviewScene.Alpha,
    label: PreviewSceneNames.alpha,
    colorBlockStyle: PreviewSceneBackground.alpha,
  },
  {
    value: PreviewScene.Black,
    label: PreviewSceneNames.black,
    colorBlockStyle: PreviewSceneBackground.black,
  },
  {
    value: PreviewScene.White,
    label: PreviewSceneNames.white,
    colorBlockStyle: PreviewSceneBackground.white,
  },
  {
    value: PreviewScene.Henesys,
    label: PreviewSceneNames.henesys,
    colorBlockStyle: {
      ...PreviewSceneBackground.henesys,
      backgroundPosition: 'left bottom',
    },
  },
];

export const CharacterSceneRadioGroup = () => {
  const scene = useStore($currentScene);

  function handleChange(detail: RadioButtonGroup.ValueChangeDetails) {
    $currentScene.set(detail.value as PreviewScene);
  }

  return (
    <RadioButtonGroup.Root value={scene()} onValueChange={handleChange}>
      <HStack columns={options.length} alignItems="center" gap={2}>
        <Index each={options}>
          {(option) => (
            <RadioButtonGroup.Item
              value={option().value}
              width="6"
              height="6"
              padding="unset"
              minWidth="0"
              title={option().label}
              borderWidth={2}
              class={css(option().colorBlockStyle)}
            >
              <RadioButtonGroup.ItemControl />
              <RadioButtonGroup.ItemHiddenInput />
            </RadioButtonGroup.Item>
          )}
        </Index>
      </HStack>
    </RadioButtonGroup.Root>
  );
};
