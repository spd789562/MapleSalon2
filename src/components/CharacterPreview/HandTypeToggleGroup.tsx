import { createMemo } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate, useLocale } from '@/context/i18n';

import { $currentHandType } from '@/store/character/selector';
import { setCharacterHandType } from '@/store/character/action';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import { CharacterHandType } from '@/const/hand';

export const HandTypeToggleGroup = () => {
  const locale = useLocale();
  const t = useTranslate();
  const earType = useStore($currentHandType);
  function handleHandTypeChange(details: ValueChangeDetails) {
    setCharacterHandType(details.value as CharacterHandType);
  }

  const options = createMemo(() => {
    const _ = locale();
    return [
      {
        label: t('character.handTypeSingle'),
        value: CharacterHandType.SingleHand,
      },
      {
        label: t('character.handTypeDouble'),
        value: CharacterHandType.DoubleHand,
      },
      {
        label: t('character.handTypeGun'),
        value: CharacterHandType.Gun,
      },
    ];
  });

  return (
    <SimpleToggleGroup
      size="sm"
      options={options()}
      value={earType()}
      onValueChange={handleHandTypeChange}
    />
  );
};
