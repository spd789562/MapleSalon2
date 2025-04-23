import type { JSX } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $colorMode, setColorMode } from '@/store/settingDialog';

import SunIcon from 'lucide-solid/icons/sun';
import MoonIcon from 'lucide-solid/icons/moon';
import SettingsIcon from 'lucide-solid/icons/settings';
import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import { ColorMode, syncColorMode } from '@/const/setting/colorMode';
import { updateBackgroundColorBaseOnColorMode } from '@/store/scene';

export const ColorModeToggleGroup = () => {
  const t = useTranslate();
  const colorMode = useStore($colorMode);

  function handleChange(details: ValueChangeDetails) {
    const changedColorMode = details.value as ColorMode;
    if (changedColorMode) {
      syncColorMode(changedColorMode);
      setColorMode(changedColorMode);
      updateBackgroundColorBaseOnColorMode(changedColorMode);
    }
  }
  const options = [
    {
      label: (() => <SunIcon size={16} />) as unknown as JSX.Element,
      value: ColorMode.Light,
      title: t('setting.colorLight'),
    },
    {
      label: (() => <MoonIcon size={16} />) as unknown as JSX.Element,
      value: ColorMode.Dark,
      title: t('setting.colorDark'),
    },
    {
      label: (() => <SettingsIcon size={16} />) as unknown as JSX.Element,
      value: ColorMode.System,
      title: t('setting.colorSystem'),
    },
  ];

  return (
    <SimpleToggleGroup
      size="sm"
      options={options}
      value={colorMode()}
      onValueChange={handleChange}
    />
  );
};
