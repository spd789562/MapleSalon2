import { Index } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import {
  $gifBackgroundColor,
  setGifBackgroundColor,
} from '@/store/settingDialog';
import { useHoverTrigger } from '@/hook/hoverTrigger';

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

export const GifBackgroundColorPicker = () => {
  const t = useTranslate();

  const {
    isOpen,
    onHover: handleHoverTrigger,
    resetHoverTimer: handleResetHoverTimer,
    onOutsideClick: handleOutsideClick,
  } = useHoverTrigger({ delay: HOVER_DELAY });

  const color = useStore($gifBackgroundColor);

  const handleColorChange = (details: ColorPicker.ValueChangeDetails) => {
    setGifBackgroundColor(details.value.toString('rgba'));
  };

  return (
    <ColorPicker.Root
      open={isOpen()}
      value={color()}
      defaultValue="#000000"
      onInteractOutside={handleOutsideClick}
      onValueChange={handleColorChange}
    >
      <ColorPicker.Control
        onMouseOver={handleHoverTrigger}
        onMouseOut={handleResetHoverTimer}
      >
        <ColorPicker.Trigger
          asChild={(triggerProps) => (
            <IconButton variant="outline" {...triggerProps()} size="sm">
              <ColorPicker.Swatch value={color()} />
            </IconButton>
          )}
        />
      </ColorPicker.Control>
      {/* <Portal> */}
      <ColorPicker.Positioner>
        <ColorPicker.Content>
          <Stack gap="3">
            <ColorPicker.Area>
              <ColorPicker.AreaBackground />
              <ColorPicker.AreaThumb />
            </ColorPicker.Area>
            <HStack gap="3">
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
                {t('scene.defaultColor')}
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
      {/* </Portal> */}
    </ColorPicker.Root>
  );
};
