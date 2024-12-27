import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import {
  $currentEquipDrawerTab,
  CurrentEquipDrawerTab,
} from '@/store/currentEquipDrawer';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

export const CurrentEquipDrawerTabs = () => {
  const t = useTranslate();
  const equipTab = useStore($currentEquipDrawerTab);

  function handleChange(value: ValueChangeDetails) {
    $currentEquipDrawerTab.set(value.value as CurrentEquipDrawerTab);
  }
  const options = [
    {
      value: CurrentEquipDrawerTab.Equip,
      label: t('tab.currentEquipment'),
    },
    {
      value: CurrentEquipDrawerTab.Setting,
      label: t('tab.characterSetting'),
    },
  ];

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
