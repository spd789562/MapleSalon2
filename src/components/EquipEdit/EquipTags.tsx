import { Show, createMemo } from 'solid-js';
import { useTranslate } from '@/context/i18n';

import { toggleItemEffectVisiblity } from '@/store/character/action';
import { createGetItemChangeById } from '@/store/character/selector';
import { useDynamicPureStore } from '@/store';

import type { EquipItem } from '@/store/string';

import { HStack } from 'styled-system/jsx/hstack';
import { Kbd } from '@/components/ui/kbd';

export interface EquipTagsProps {
  info?: EquipItem;
}
export const EquipTags = (props: EquipTagsProps) => {
  const t = useTranslate();
  const getItemChangeById = createMemo(() =>
    createGetItemChangeById(props.info?.id!),
  );
  const itemChange = useDynamicPureStore(getItemChangeById);

  function handleClickEffectTag() {
    const category = itemChange()?.category;
    if (category === 'Head') {
      toggleItemEffectVisiblity('Head');
      toggleItemEffectVisiblity('Body');
    } else if (category) {
      toggleItemEffectVisiblity(category);
    }
  }

  return (
    <Show when={props.info}>
      {(info) => (
        <HStack gap="1" ml="1" display="inline-flex">
          <Show when={info().isCash}>
            <Kbd size="sm">{t('common.equipCash')}</Kbd>
          </Show>
          <Show when={info().isDyeable}>
            <Kbd size="sm">{t('common.equipDyeable')}</Kbd>
          </Show>
          <Show when={info().hasEffect}>
            <Kbd
              size="sm"
              userSelect="none"
              cursor="pointer"
              opacity={(itemChange()?.item.visibleEffect ?? true) ? 1 : 0.6}
              onClick={handleClickEffectTag}
            >
              {t('common.equipEffect')}
            </Kbd>
          </Show>
        </HStack>
      )}
    </Show>
  );
};
