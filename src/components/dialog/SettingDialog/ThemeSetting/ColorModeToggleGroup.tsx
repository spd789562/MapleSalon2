import type { JSX } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $colorMode, setColorMode } from '@/store/settingDialog';

import SunIcon from 'lucide-solid/icons/sun';
import MoonIcon from 'lucide-solid/icons/moon';
import SettingsIcon from 'lucide-solid/icons/settings';
import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import {
  ColorMode,
  ColorModeNames,
  syncColorMode,
} from '@/const/setting/colorMode';

const options = [
  {
    label: (() => <SunIcon size={16} />) as unknown as JSX.Element,
    value: ColorMode.Light,
    title: ColorModeNames[ColorMode.Light],
  },
  {
    label: (() => <MoonIcon size={16} />) as unknown as JSX.Element,
    value: ColorMode.Dark,
    title: ColorModeNames[ColorMode.Dark],
  },
  {
    label: (() => <SettingsIcon size={16} />) as unknown as JSX.Element,
    value: ColorMode.System,
    title: ColorModeNames[ColorMode.System],
  },
];

export const ColorModeToggleGroup = () => {
  const colorMode = useStore($colorMode);

  function handleChange(details: ValueChangeDetails) {
    const changedColorMode = details.value as ColorMode;
    if (changedColorMode) {
      syncColorMode(changedColorMode);
      setColorMode(changedColorMode);
    }
  }

  return (
    <SimpleToggleGroup
      size="sm"
      options={options}
      value={colorMode()}
      onValueChange={handleChange}
    />
  );
};
