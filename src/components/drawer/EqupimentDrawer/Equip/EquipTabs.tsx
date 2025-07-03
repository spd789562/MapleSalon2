import { useStore } from '@nanostores/solid';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

import { $equipmentDrawerEquipTab, EquipTab } from '@/store/equipDrawer';

import {
  SimpleSegmentGroup,
  type ValueChangeDetails,
} from '@/components/ui/segmentGroup';

export const EquipTabs = () => {
  const equipTab = useStore($equipmentDrawerEquipTab);

  function handleChange(value: ValueChangeDetails) {
    $equipmentDrawerEquipTab.set(value.value as EquipTab);
  }

  const options = useLocalizedOptions([
    {
      value: EquipTab.Equip,
      label: 'tab.equipment',
    },
    {
      value: EquipTab.Hair,
      label: 'tab.hair',
    },
    {
      value: EquipTab.Face,
      label: 'tab.face',
    },
    {
      value: EquipTab.History,
      label: 'tab.equipHistory',
    },
    {
      value: EquipTab.Favorite,
      label: 'tab.saved',
    },
  ]);

  return (
    <SimpleSegmentGroup
      options={options()}
      value={equipTab()}
      onValueChange={handleChange}
      orientation="horizontal"
    />
  );
};
