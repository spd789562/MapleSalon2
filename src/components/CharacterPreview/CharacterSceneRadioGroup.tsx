import { Index } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { css } from 'styled-system/css';

import ImageIcon from 'lucide-solid/icons/image';
import MapPinned from 'lucide-solid/icons/map-pinned';
import { $currentScene, $sceneCustomColor } from '@/store/scene';
import { HStack } from 'styled-system/jsx/hstack';
import * as RadioButtonGroup from '@/components/ui/radioButtonGroup';
import { CharacterSceneColorPicker } from './CharacterSceneColorPicker';
import { CharacterSceneBackgroundPopover } from './CharacterSceneBackgroundPopover';
import { CharacterSceneMapPopover } from './CharacterSceneMapPopover';

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
    value: PreviewScene.Grid,
    label: PreviewSceneNames.grid,
    colorBlockStyle: PreviewSceneBackground.grid,
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
  const customColor = useStore($sceneCustomColor);

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
        <CharacterSceneColorPicker>
          <RadioButtonGroup.Item
            value="color"
            width="6"
            height="6"
            padding="unset"
            minWidth="0"
            title={PreviewSceneNames.color}
            borderWidth={2}
            transition-property="border-color, color, box-shadow"
            style={{
              'background-color': customColor(),
            }}
          >
            <RadioButtonGroup.ItemControl />
            <RadioButtonGroup.ItemHiddenInput />
          </RadioButtonGroup.Item>
        </CharacterSceneColorPicker>
        <CharacterSceneBackgroundPopover>
          <RadioButtonGroup.Item
            value="custom"
            width="6"
            height="6"
            padding="unset"
            minWidth="0"
            title={PreviewSceneNames.custom}
            backgroundColor="bg.default"
            borderWidth={2}
            color="fg.subtle"
            transition-property="border-color, color, box-shadow"
          >
            <ImageIcon size="12" />
            <RadioButtonGroup.ItemControl />
            <RadioButtonGroup.ItemHiddenInput />
          </RadioButtonGroup.Item>
        </CharacterSceneBackgroundPopover>
        <CharacterSceneMapPopover>
          <RadioButtonGroup.Item
            value="mapleMap"
            width="6"
            height="6"
            padding="unset"
            minWidth="0"
            title={PreviewSceneNames.mapleMap}
            backgroundColor="bg.default"
            borderWidth={2}
            color="fg.subtle"
            transition-property="border-color, color, box-shadow"
          >
            <MapPinned size="12" />
            <RadioButtonGroup.ItemControl />
            <RadioButtonGroup.ItemHiddenInput />
          </RadioButtonGroup.Item>
        </CharacterSceneMapPopover>
      </HStack>
    </RadioButtonGroup.Root>
  );
};
