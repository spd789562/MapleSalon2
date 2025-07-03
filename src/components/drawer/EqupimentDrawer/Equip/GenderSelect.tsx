import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';
import { useLocalizedOptions } from '@/hook/useLocalizedOptions';

import { $equipmentDrawerGender } from '@/store/equipDrawer';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';

import { Gender } from '@/utils/itemId';

export const GenderSelect = () => {
  const t = useTranslate();

  const gender = useStore($equipmentDrawerGender);

  const options = useLocalizedOptions([
    {
      label: 'character.genderAll',
      value: Gender.All.toString(),
    },
    {
      label: 'character.genderMale',
      value: Gender.Male.toString(),
    },
    {
      label: 'character.genderFemale',
      value: Gender.Female.toString(),
    },
    {
      label: 'character.genderShare',
      value: Gender.Share.toString(),
    },
  ]);

  function handleChange(details: ValueChangeDetails) {
    if (details.value?.[0]) {
      const numbered = Number.parseInt(details.value[0]);
      if (!Number.isNaN(numbered)) {
        $equipmentDrawerGender.set(numbered as Gender);
      }
    }
  }

  return (
    <HStack>
      <Text size="sm" whiteSpace="nowrap">
        {t('character.gender')}
      </Text>
      <SimpleSelect
        positioning={{
          sameWidth: false,
        }}
        items={options()}
        value={[gender().toString()]}
        onValueChange={handleChange}
        maxHeight="20rem"
        width="4.8rem"
        size="sm"
      />
    </HStack>
  );
};
