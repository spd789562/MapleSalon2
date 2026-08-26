import { createMemo, Switch, Match } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { usePureStore } from '@/store';

import { $skillFilterdStrings } from '@/store/skill';
import {
  $equipmentDrawerEquipListType,
  $equipmentDrawerExtraColumns,
  getEquipDrawerColumnCount,
  EquipListType,
} from '@/store/equipDrawer';

import { RowVirtualizer } from '@/components/ui/rowVirtualizer';
import { SkillButton } from './SkillButton';
import { SkillRowButton } from './SkillRowButton';

const DefaultHeightMap = {
  [EquipListType.Row]: 36,
  [EquipListType.Icon]: 45,
  [EquipListType.Character]: 90,
};

export const SkillList = () => {
  const equipRenderType = useStore($equipmentDrawerEquipListType);
  const extraColumns = useStore($equipmentDrawerExtraColumns);
  const skillStrings = usePureStore($skillFilterdStrings);

  const columnCount = createMemo(() =>
    getEquipDrawerColumnCount(equipRenderType(), extraColumns()),
  );
  const defaultItemHeight = createMemo(
    () => DefaultHeightMap[equipRenderType()],
  );

  return (
    <RowVirtualizer
      defaultItemHeight={defaultItemHeight()}
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
