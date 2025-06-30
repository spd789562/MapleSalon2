import { createMemo } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate, useLocale } from '@/context/i18n';

import { $equipmentDrawerEquipTab, EquipTab } from '@/store/equipDrawer';

import {
  SimpleSegmentGroup,
  type ValueChangeDetails,
} from '@/components/ui/segmentGroup';

export const EquipTabs = () => {
  const t = useTranslate();
  const locale = useLocale();
  const equipTab = useStore($equipmentDrawerEquipTab);

  function handleChange(value: ValueChangeDetails) {
    $equipmentDrawerEquipTab.set(value.value as EquipTab);
  }

  const options = createMemo(() => {
    const _ = locale();
    return [
      {
        value: EquipTab.Equip,
        label: t('tab.equipment'),
      },
      {
        value: EquipTab.Hair,
        label: t('tab.hair'),
      },
      {
        value: EquipTab.Face,
        label: t('tab.face'),
      },
      {
        value: EquipTab.History,
        label: t('tab.equipHistory'),
      },
      {
        value: EquipTab.Favorite,
        label: t('tab.saved'),
      },
    ];
  });

  return (
    <SimpleSegmentGroup
      options={options()}
      value={equipTab()}
      onValueChange={handleChange}
      orientation="horizontal"
    />
  );
};
