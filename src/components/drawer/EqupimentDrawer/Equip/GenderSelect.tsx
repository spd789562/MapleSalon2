import { createMemo } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { useTranslate, useLocale } from '@/context/i18n';

import { $equipmentDrawerGender } from '@/store/equipDrawer';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { SimpleSelect, type ValueChangeDetails } from '@/components/ui/select';

import { Gender } from '@/utils/itemId';

export const GenderSelect = () => {
  const t = useTranslate();
  const locale = useLocale();

  const gender = useStore($equipmentDrawerGender);

  const options = createMemo(() => {
    const _ = locale();
    return [
      {
        label: t('character.genderAll'),
        value: Gender.All.toString(),
      },
      {
        label: t('character.genderMale'),
        value: Gender.Male.toString(),
      },
      {
        label: t('character.genderFemale'),
        value: Gender.Female.toString(),
      },
      {
        label: t('character.genderShare'),
        value: Gender.Share.toString(),
      },
    ];
  });

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
        width="4.5rem"
        size="sm"
      />
    </HStack>
  );
};
