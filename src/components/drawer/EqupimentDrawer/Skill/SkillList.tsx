import { Switch, Match } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { usePureStore } from '@/store';

import { $skillFilterdStrings } from '@/store/skill';
import {
  $equipmentDrawerEquipListType,
  EquipListType,
} from '@/store/equipDrawer';
import { useEquipDrawerListLayout } from '@/hook/equipDrawerList';

import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { SkillButton } from './SkillButton';
import { SkillRowButton } from './SkillRowButton';

export const SkillList = () => {
  const equipRenderType = useStore($equipmentDrawerEquipListType);
  const skillStrings = usePureStore($skillFilterdStrings);
  const { columnCount, itemHeight } = useEquipDrawerListLayout(equipRenderType);

  return (
    <RowVirtualizer
      defaultItemHeight={itemHeight()}
      columnCount={columnCount()}
      renderItem={(item, index) => (
        <Switch>
          <Match when={equipRenderType() === EquipListType.Icon}>
            <SkillButton
              item={item}
              index={index}
              columnCount={columnCount()}
            />
          </Match>
          <Match when={equipRenderType() === EquipListType.Row}>
            <SkillRowButton item={item} />
          </Match>
        </Switch>
      )}
      data={skillStrings()}
    />
  );
};
