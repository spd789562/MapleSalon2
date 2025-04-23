import type { EquipCategorySelections } from '@/store/equipDrawer';

import type { Icon } from 'lucide-solid';
import { AllCategory } from '@/const/equipments';
import { IconType, type SvgIcon } from '@/const/icon';

import LayoutGridIcon from 'lucide-solid/icons/layout-grid';
import ShieldIcon from 'lucide-solid/icons/shield';
import SwordIcon from 'lucide-solid/icons/sword';
import SwordsIcon from 'lucide-solid/icons/swords';
import GlassesIcon from 'lucide-solid/icons/glasses';
import SmileIcon from 'lucide-solid/icons/smile';
import SmilePlusIcon from 'lucide-solid/icons/smile-plus';
import IdCardIcon from 'lucide-solid/icons/id-card';
import MessageSquareMore from 'lucide-solid/icons/message-square-more';
import DollarSignIcon from 'lucide-solid/icons/circle-dollar-sign';
import AwardIcon from 'lucide-solid/icons/award';
import GitCommitHorizontal from 'lucide-solid/icons/git-commit-horizontal';
import NotepadTextIcon from 'lucide-solid/icons/notepad-text';
import CoatLineIcon from 'mingcute_icon/svg/part/coat_line.svg';
import HatLineIcon from 'mingcute_icon/svg/part/hat_line.svg';
import EarLineIcon from 'mingcute_icon/svg/part/ear_line.svg';
import tShirt2LineIcon from 'mingcute_icon/svg/part/t_shirt_2_line.svg';
import TrouserLineIcon from 'mingcute_icon/svg/part/trouser_line.svg';
import ShoeLineIcon from 'mingcute_icon/svg/part/shoe_line.svg';
import GloveLineIcon from 'mingcute_icon/svg/part/glove_line.svg';
import ySkewLineIcon from 'mingcute_icon/svg/design/y_skew_line.svg';
import FaceLineIcon from 'mingcute_icon/svg/part/face_line.svg';
import HairLineIcon from 'mingcute_icon/svg/part/hair_2_line.svg';
import StopCircleLineIcon from 'mingcute_icon/svg/media/stop_circle_line.svg';
import LoadingIcon from 'mingcute_icon/svg/system/loading_4_line.svg';

export interface DynamicIcon {
  type: IconType;
  icon: typeof Icon | SvgIcon;
}

export const CategoryIconMap: Partial<
  Record<EquipCategorySelections, DynamicIcon>
> = {
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
  Hair: { type: IconType.Svg, icon: HairLineIcon },
  Face: { type: IconType.Svg, icon: SmileIcon },
  NameTag: { type: IconType.Lucide, icon: IdCardIcon },
  ChatBalloon: { type: IconType.Lucide, icon: MessageSquareMore },
  Effect: { type: IconType.Svg, icon: DollarSignIcon },
  RingEffect: { type: IconType.Svg, icon: StopCircleLineIcon },
  NecklaceEffect: { type: IconType.Svg, icon: LoadingIcon },
  BeltEffect: { type: IconType.Svg, icon: GitCommitHorizontal },
  Medal: { type: IconType.Lucide, icon: AwardIcon },
  NickTag: { type: IconType.Lucide, icon: NotepadTextIcon },
  [AllCategory]: { type: IconType.Lucide, icon: LayoutGridIcon },
};
