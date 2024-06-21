import { Dynamic, Switch, Match, Show } from 'solid-js/web';

import type { EquipCategorySelections } from '@/store/equipDrawer';

import type { Icon } from 'lucide-solid';
import { AllCategory } from '@/const/equipments';
import { IconType, type SvgIcon } from '@/const/icon';

import LayoutGridIcon from 'lucide-solid/icons/layout-grid';
import ShieldIcon from 'lucide-solid/icons/shield';
import SwordIcon from 'lucide-solid/icons/sword';
import SwordsIcon from 'lucide-solid/icons/swords';
import GlassesIcon from 'lucide-solid/icons/glasses';
import SmilePlusIcon from 'lucide-solid/icons/smile-plus';
import CoatLineIcon from 'mingcute_icon/svg/part/coat_line.svg';
import HatLineIcon from 'mingcute_icon/svg/part/hat_line.svg';
import EarLineIcon from 'mingcute_icon/svg/part/ear_line.svg';
import tShirt2LineIcon from 'mingcute_icon/svg/part/t_shirt_2_line.svg';
import TrouserLineIcon from 'mingcute_icon/svg/part/trouser_line.svg';
import ShoeLineIcon from 'mingcute_icon/svg/part/shoe_line.svg';
import GloveLineIcon from 'mingcute_icon/svg/part/glove_line.svg';
import ySkewLineIcon from 'mingcute_icon/svg/design/y_skew_line.svg';
import FaceLineIcon from 'mingcute_icon/svg/part/face_line.svg';

interface DynamicIcon {
  type: IconType;
  icon: typeof Icon | SvgIcon;
}

const IconMap: Partial<Record<EquipCategorySelections, DynamicIcon>> = {
  Weapon: { type: IconType.Lucide, icon: SwordIcon },
  CashWeapon: { type: IconType.Lucide, icon: SwordsIcon },
  Cap: { type: IconType.Svg, icon: HatLineIcon },
  Overall: { type: IconType.Svg, icon: CoatLineIcon },
  Coat: { type: IconType.Svg, icon: tShirt2LineIcon },
  Pants: { type: IconType.Svg, icon: TrouserLineIcon },
  Cape: { type: IconType.Svg, icon: ySkewLineIcon },
  Glove: { type: IconType.Svg, icon: GloveLineIcon },
  Shoes: { type: IconType.Svg, icon: ShoeLineIcon },
  'Eye Decoration': { type: IconType.Lucide, icon: GlassesIcon },
  'Face Accessory': { type: IconType.Lucide, icon: SmilePlusIcon },
  Earrings: { type: IconType.Svg, icon: EarLineIcon },
  Shield: { type: IconType.Lucide, icon: ShieldIcon },
  Skin: { type: IconType.Svg, icon: FaceLineIcon },
  [AllCategory]: { type: IconType.Lucide, icon: LayoutGridIcon },
};

interface CategorySelectionIconProps {
  category: EquipCategorySelections;
  size: number;
}
export const CategorySelectionIcon = (props: CategorySelectionIconProps) => {
  return (
    <Show
      when={IconMap[props.category]}
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
