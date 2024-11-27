import { useStore } from '@nanostores/solid';

import { $equipmentDrawerEquipTab, EquipTab } from '@/store/equipDrawer';

import {
  SimpleSegmentGroup,
  type ValueChangeDetails,
} from '@/components/ui/segmentGroup';

const options = [
  {
    value: EquipTab.Equip,
    label: '裝備',
  },
  {
    value: EquipTab.Hair,
    label: '髮型',
  },
  {
    value: EquipTab.Face,
    label: '臉型',
  },
  {
    value: EquipTab.History,
    label: '近期使用',
  },
  {
    value: EquipTab.Favorite,
    label: '收藏',
  },
];

export const EquipTabs = () => {
  const equipTab = useStore($equipmentDrawerEquipTab);

  function handleChange(value: ValueChangeDetails) {
    $equipmentDrawerEquipTab.set(value.value as EquipTab);
  }

  return (
    <SimpleSegmentGroup
      options={options}
      value={equipTab()}
      onValueChange={handleChange}
      orientation="horizontal"
    />
  );
};
