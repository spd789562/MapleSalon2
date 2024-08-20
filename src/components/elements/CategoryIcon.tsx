import { Dynamic, Switch, Match, Show } from 'solid-js/web';

import type { EquipCategorySelections } from '@/store/equipDrawer';

import LayoutGridIcon from 'lucide-solid/icons/layout-grid';

import { IconType } from '@/const/icon';
import { CategoryIconMap } from '@/const/categoryIcon';

interface CategoryIconProps {
  category: EquipCategorySelections;
  size: number;
}
export const CategoryIcon = (props: CategoryIconProps) => {
  return (
    <Show
      when={CategoryIconMap[props.category]}
      fallback={<LayoutGridIcon size={props.size} />}
    >
      {(icon) => (
        <Switch>
          <Match when={icon().type === IconType.Lucide}>
            <Dynamic component={icon().icon} size={props.size} />
          </Match>
          <Match when={icon().type === IconType.Svg}>
            <Dynamic
              component={icon().icon}
              width={props.size}
              height={props.size}
            />
          </Match>
        </Switch>
      )}
    </Show>
  );
};
