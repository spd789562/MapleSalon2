import { useStore } from '@nanostores/solid';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

import {
  $currentEquipDrawerTab,
  CurrentEquipDrawerTab,
} from '@/store/currentEquipDrawer';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

export const CurrentEquipDrawerTabs = () => {
  const equipTab = useStore($currentEquipDrawerTab);

  function handleChange(value: ValueChangeDetails) {
    $currentEquipDrawerTab.set(value.value as CurrentEquipDrawerTab);
  }
  const options = useLocalizedOptions([
    {
      value: CurrentEquipDrawerTab.Equip,
      label: 'tab.currentEquipment',
    },
    {
      value: CurrentEquipDrawerTab.Setting,
      label: 'tab.characterSetting',
    },
  ]);

  return (
    <SimpleToggleGroup
      options={options()}
      value={equipTab()}
      onValueChange={handleChange}
      size="xs"
      orientation="horizontal"
    />
  );
};
