import { Switch, Match } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { type I18nKeys, useTranslate } from '@/context/i18n';

import {
  $equipmentDrawerEquipListType,
  EquipListType,
} from '@/store/equipDrawer';

import LayoutGridIcon from 'lucide-solid/icons/layout-grid';
import LayoutListIcon from 'lucide-solid/icons/layout-list';
import { IconButton } from '@/components/ui/icon-button';

const TitleMap: Record<EquipListType, I18nKeys> = {
  [EquipListType.Icon]: 'common.switchListTypeRow',
  [EquipListType.Row]: 'common.switchListTypeGrid',
  [EquipListType.Character]: 'common.switchListTypeUnknown',
};

export const EquipListTypeButton = () => {
  const t = useTranslate();

  const listType = useStore($equipmentDrawerEquipListType);

  const title = () => TitleMap[listType()];

  function handleListTypeChange() {
    switch (listType()) {
      case EquipListType.Icon:
        $equipmentDrawerEquipListType.set(EquipListType.Row);
        break;
      case EquipListType.Row:
        $equipmentDrawerEquipListType.set(EquipListType.Icon);
        break;
      case EquipListType.Character:
        // unreachable
        break;
      default:
        break;
    }
  }

  return (
    <IconButton
      size="md"
      variant="outline"
      title={t(title()) as string}
      onClick={handleListTypeChange}
    >
      <Switch>
        <Match when={listType() === EquipListType.Icon}>
          <LayoutGridIcon size={24} />
        </Match>
        <Match when={listType() === EquipListType.Row}>
          <LayoutListIcon size={24} />
        </Match>
      </Switch>
    </IconButton>
  );
};
