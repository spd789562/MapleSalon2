import { Index, type JSX, createSignal } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';

import { $sceneCustomColor } from '@/store/character/store';

import PipetteIcon from 'lucide-solid/icons/pipette';
import { HStack, Stack } from 'styled-system/jsx';
import { Input } from '@/components/ui/input';
import { Text } from '@/components/ui/text';
import { IconButton } from '@/components/ui/icon-button';
import * as ColorPicker from '@/components/ui/colorPicker';

const presets = [
  '#ffffff',
  '#000000',
  '#f5a898',
  '#f5ae73',
  '#ffe770',
  '#94ce9a',
  '#acd8fc',
  '#deade3',
];
const HOVER_DELAY = 300;

export interface CharacterSceneColorPickerProps {
  children?: JSX.Element;
}
export const CharacterSceneColorPicker = (
  props: CharacterSceneColorPickerProps,
) => {
  let hoverTimer: number | null = null;
  const color = useStore($sceneCustomColor);
  const [isOpen, setIsOpen] = createSignal(false);

  const handleHoverTrigger = () => {
    if (isOpen()) {
      return;
    }
    hoverTimer && clearTimeout(hoverTimer);
    hoverTimer = setTimeout(() => {
      setIsOpen(true);
    }, HOVER_DELAY);
  };
  const handleResetHoverTimer = () => {
    hoverTimer && clearTimeout(hoverTimer);
  };
  const handleOutsideClick = () => {
    setIsOpen(false);
  };
  const handleColorChange = (details: ColorPicker.ValueChangeDetails) => {
    $sceneCustomColor.set(details.value.toString('rgba'));
  };

  return (
    <ColorPicker.Root
      open={isOpen()}
      value={color()}
      defaultValue="#ffffff"
      positioning={{
        strategy: 'fixed',
      }}
      onInteractOutside={handleOutsideClick}
      onValueChange={handleColorChange}
    >
      <ColorPicker.Control
        onMouseOver={handleHoverTrigger}
        onMouseOut={handleResetHoverTimer}
      >
        <ColorPicker.Trigger>{props.children}</ColorPicker.Trigger>
      </ColorPicker.Control>
      <Portal>
        <ColorPicker.Positioner>
          <ColorPicker.Content>
            <Stack gap="3">
              <ColorPicker.Area>
                <ColorPicker.AreaBackground />
                <ColorPicker.AreaThumb />
              </ColorPicker.Area>
              <HStack gap="3">
                <ColorPicker.EyeDropperTrigger
                  asChild={(props) => (
                    <IconButton
                      size="xs"
                      variant="outline"
                      aria-label="顏色選擇器"
                      {...props()}
                    >
                      <PipetteIcon />
                    </IconButton>
                  )}
                />
                <Stack gap="2" flex="1">
                  <ColorPicker.ChannelSlider channel="hue">
                    <ColorPicker.ChannelSliderTrack />
                    <ColorPicker.ChannelSliderThumb />
                  </ColorPicker.ChannelSlider>
                  <ColorPicker.ChannelSlider channel="saturation">
                    <ColorPicker.ChannelSliderTrack />
                    <ColorPicker.ChannelSliderThumb />
                  </ColorPicker.ChannelSlider>
                  <ColorPicker.ChannelSlider channel="brightness">
                    <ColorPicker.ChannelSliderTrack />
                    <ColorPicker.ChannelSliderThumb />
                  </ColorPicker.ChannelSlider>
                </Stack>
              </HStack>
              <HStack>
                <ColorPicker.ChannelInput
                  channel="hex"
                  asChild={(props) => <Input size="2xs" {...props()} />}
                />
              </HStack>
              <Stack gap="1.5">
                <Text size="xs" fontWeight="medium" color="fg.default">
                  預設顏色
                </Text>
                <ColorPicker.SwatchGroup>
                  <Index each={presets}>
                    {(color) => (
                      <ColorPicker.SwatchTrigger value={color()}>
                        <ColorPicker.Swatch value={color()} boxShadow="md" />
                      </ColorPicker.SwatchTrigger>
                    )}
                  </Index>
                </ColorPicker.SwatchGroup>
              </Stack>
            </Stack>
          </ColorPicker.Content>
        </ColorPicker.Positioner>
      </Portal>
    </ColorPicker.Root>
  );
};
