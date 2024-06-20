import { Index } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $equipmentDrawerEquipTab, EquipTab } from '@/store/equipDrawer';

import * as SegmentGroup from '@/components/ui/segmentGroup';

const options = [
  {
    id: EquipTab.Equip,
    label: '裝備',
  },
  {
    id: EquipTab.Hair,
    label: '髮型',
  },
  {
    id: EquipTab.Face,
    label: '臉型',
  },
  {
    id: EquipTab.History,
    label: '近期使用',
  },
];

export const EquipTabs = () => {
  const equipTab = useStore($equipmentDrawerEquipTab);

  function handleChange(value: SegmentGroup.ValueChangeDetails) {
    $equipmentDrawerEquipTab.set(value.value as EquipTab);
  }

  return (
    <SegmentGroup.Root
      value={equipTab()}
      onValueChange={handleChange}
      orientation="horizontal"
      mt={-2}
      mb={2}
      mx={-2}
    >
      <Index each={options}>
        {(option) => (
          <SegmentGroup.Item value={option().id}>
            <SegmentGroup.ItemText>{option().label}</SegmentGroup.ItemText>
            <SegmentGroup.ItemControl />
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        )}
      </Index>
      <SegmentGroup.Indicator />
    </SegmentGroup.Root>
  );
};
