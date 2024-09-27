import { useStore } from '@nanostores/solid';

import {
  $currentEquipDrawerTab,
  CurrentEquipDrawerTab,
} from '@/store/currentEquipDrawer';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

const options = [
  {
    value: CurrentEquipDrawerTab.Equip,
    label: '當前裝備',
  },
  {
    value: CurrentEquipDrawerTab.Setting,
    label: '角色設定',
  },
];

export const CurrentEquipDrawerTabs = () => {
  const equipTab = useStore($currentEquipDrawerTab);

  function handleChange(value: ValueChangeDetails) {
    $currentEquipDrawerTab.set(value.value as CurrentEquipDrawerTab);
  }

  return (
    <SimpleToggleGroup
      options={options}
      value={equipTab()}
      onValueChange={handleChange}
      size="xs"
      orientation="horizontal"
    />
  );
};
