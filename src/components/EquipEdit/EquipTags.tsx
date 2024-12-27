import { Show } from 'solid-js';
import { useTranslate } from '@/context/i18n';

import type { EquipItem } from '@/store/string';

import { HStack } from 'styled-system/jsx/hstack';
import { Kbd } from '@/components/ui/kbd';

export interface EquipTagsProps {
  info?: EquipItem;
}
export const EquipTags = (props: EquipTagsProps) => {
  const t = useTranslate();
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
            <Kbd size="sm">{t('common.equipEffect')}</Kbd>
          </Show>
        </HStack>
      )}
    </Show>
  );
};
