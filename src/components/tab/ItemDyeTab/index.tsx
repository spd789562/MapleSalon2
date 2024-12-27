import { styled } from 'styled-system/jsx/factory';
import { useTranslate } from '@/context/i18n';

import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { ItemDyeTabTitle } from './ItemDyeTabTitle';
import { NeedDyeItemToggleGroup } from './NeedDyeItemToggleGroup';
import { DyeTypeRadioGroup } from './DyeTypeRadioGroup';
import { ResultCountNumberInput } from './ResultCountNumberInput';
import { ResultActionSelect } from './ResultActionSelect';
import { StartDyeButton } from './StartDyeButton';
import { DyeResult } from './DyeResult';

export const ItemDyeTab = () => {
  const t = useTranslate();
  return (
    <Stack mb="4" overflow="auto">
      <CardContainer gap={4}>
        <ItemDyeTabTitle />
        <HStack>
          <Heading width="7rem">{t('dye.dyeEquipments')}</Heading>
          <NeedDyeItemToggleGroup />
        </HStack>
        <HStack>
          <Heading width="7rem">{t('dye.dyeType')}</Heading>
          <DyeTypeRadioGroup />
        </HStack>
        <HStack>
          <Heading width="7rem">{t('dye.otherSetting')}</Heading>
          <HStack>
            <Text width="7rem">{t('dye.dyeAction')}</Text>
            <ResultActionSelect />
          </HStack>
          <HStack>
            <Text>{t('dye.dyeCount')}</Text>
            <ResultCountNumberInput />
          </HStack>
        </HStack>
        <div>
          <StartDyeButton />
        </div>
      </CardContainer>
      <CardContainer>
        <DyeResult />
      </CardContainer>
    </Stack>
  );
};

export const CardContainer = styled(Stack, {
  base: {
    p: 4,
    borderRadius: 'md',
    boxShadow: 'md',
    backgroundColor: 'bg.default',
    width: '100%',
  },
});
