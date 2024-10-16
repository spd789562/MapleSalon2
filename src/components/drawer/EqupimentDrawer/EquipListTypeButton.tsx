import { Switch, Match } from 'solid-js';
import { useStore } from '@nanostores/solid';

import {
  $equipmentDrawerEquipListType,
  EquipListType,
} from '@/store/equipDrawer';

import LayoutGridIcon from 'lucide-solid/icons/layout-grid';
import LayoutListIcon from 'lucide-solid/icons/layout-list';
import { IconButton } from '@/components/ui/icon-button';

const TitleMap = {
  [EquipListType.Icon]: '切換至清單',
  [EquipListType.Row]: '切換至縮圖',
  [EquipListType.Character]: '未實作',
};

export const EquipListTypeButton = () => {
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
      title={title()}
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
