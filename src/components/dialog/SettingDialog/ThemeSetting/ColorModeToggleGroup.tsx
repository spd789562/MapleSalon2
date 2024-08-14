import { useStore } from '@nanostores/solid';

import { $colorMode } from '@/store/settingDialog';

import SunIcon from 'lucide-solid/icons/sun';
import MoonIcon from 'lucide-solid/icons/moon';
import SettingsIcon from 'lucide-solid/icons/settings';
import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import { ColorMode, syncColorMode } from '@/const/setting/colorMode';

const options = [
  {
    label: <SunIcon size={16} />,
    value: ColorMode.Light,
  },
  {
    label: <MoonIcon size={16} />,
    value: ColorMode.Dark,
  },
  {
    label: <SettingsIcon size={16} />,
    value: ColorMode.System,
  },
];

export const ColorModeToggleGroup = () => {
  const colorMode = useStore($colorMode);

  function handleChange(details: ValueChangeDetails) {
    const firstItem = details.value?.[0];
    firstItem && syncColorMode(firstItem as ColorMode);
  }

  return (
    <SimpleToggleGroup
      size="sm"
      options={options}
      value={[colorMode()]}
      onValueChange={handleChange}
    />
  );
};
