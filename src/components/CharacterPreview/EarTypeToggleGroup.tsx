import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $currentEarType } from '@/store/character/selector';
import { setCharacterEarType } from '@/store/character/action';

import {
  SimpleToggleGroup,
  type ValueChangeDetails,
} from '@/components/ui/toggleGroup';

import { CharacterEarType } from '@/const/ears';

export const EarTypeToggleGroup = () => {
  const t = useTranslate();
  const earType = useStore($currentEarType);
  function handleEarTypeChange(details: ValueChangeDetails) {
    const firstItem = details.value;
    firstItem && setCharacterEarType(firstItem as CharacterEarType);
  }
  const options = [
    {
      label: t('character.earTypeHuman'),
      value: CharacterEarType.HumanEar,
    },
    {
      label: t('character.earTypeElf'),
      value: CharacterEarType.Ear,
    },
    {
      label: t('character.earTypeLef'),
      value: CharacterEarType.LefEar,
    },
    {
      label: t('character.earTypeHighLef'),
      value: CharacterEarType.HighLefEar,
    },
  ];

  return (
    <SimpleToggleGroup
      size="sm"
      options={options}
      value={earType()}
      onValueChange={handleEarTypeChange}
    />
  );
};
