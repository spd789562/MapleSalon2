import { Show, Switch, Match } from 'solid-js';

import type { CharacterItemInfo } from '@/store/character/store';
import { LoadableEquipIcon } from '@/components/elements/LoadableEquipIcon';
import { EllipsisText } from '@/components/ui/ellipsisText';
import {
  EquipItemContainer,
  EquipItemIcon,
  EquipItemName,
  EquipItemInfo,
} from '@/components/drawer/CurrentEquipmentDrawer/CurrentEquipList/EquipItem';
import { EquipItemHSVInfo } from '@/components/drawer/CurrentEquipmentDrawer/CurrentEquipList/EquipItemHSVInfo';
import { EquipItemMixDyeInfo } from '@/components/drawer/CurrentEquipmentDrawer/CurrentEquipList/EquipItemMixDyeInfo';
import { ItemNotExistMask } from '@/components/drawer/CurrentEquipmentDrawer/CurrentEquipList/ItemNotExistMask';
import { CategoryIcon } from '@/components/elements/CategoryIcon';

import { isDyeableId, isMixDyeableId } from '@/utils/itemId';

import type { EquipSubCategory } from '@/const/equipments';

export interface EquipItemProps {
  category: EquipSubCategory;
  item?: CharacterItemInfo;
}
export const EquipItem = (props: EquipItemProps) => {
  return (
    <Show
      when={props.item}
      fallback={<DisabledEquipItem category={props.category} />}
    >
      {(item) => (
        <EquipItemContainer gridTemplateColumns="auto auto 1fr">
          <CategoryIcon category={props.category} size={20} />
          <EquipItemIcon>
            <LoadableEquipIcon id={item().id} name={item().name} />
          </EquipItemIcon>
          <EquipItemInfo gap="0">
            <EquipItemName>
              <Show when={item().name} fallback={item().id}>
                <EllipsisText as="div" title={item().name}>
                  {item().name}
                </EllipsisText>
              </Show>
            </EquipItemName>
            <Switch>
              <Match
                when={
                  isDyeableId(item().id) &&
                  (item().hue || item().saturation || item().brightness)
                }
              >
                <EquipItemHSVInfo
                  hue={item().hue}
                  saturation={item().saturation}
                  value={item().brightness}
                />
              </Match>
              <Match when={isMixDyeableId(item().id) && item().dye}>
                <EquipItemMixDyeInfo id={item().id} dyeInfo={item().dye} />
              </Match>
            </Switch>
          </EquipItemInfo>
          <ItemNotExistMask id={item().id} />
        </EquipItemContainer>
      )}
    </Show>
  );
};

interface DisabledEquipItemProps {
  category: EquipSubCategory;
}
const DisabledEquipItem = (props: DisabledEquipItemProps) => {
  return (
    <EquipItemContainer opacity="0.5">
      <CategoryIcon category={props.category} size={20} />
    </EquipItemContainer>
  );
};
