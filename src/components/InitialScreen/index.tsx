import { styled } from 'styled-system/jsx/factory';

import { useTranslate } from '@/context/i18n';

import { Box } from 'styled-system/jsx/box';
import { VStack } from 'styled-system/jsx/vstack';
import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { LoadText } from './LoadText';
import { SelectWzButton } from './SelectWzButton';
import { SelectHistoryTable } from './SelectHistoryTable';

export const InitialScreen = () => {
  const t = useTranslate();

  return (
    <ScreenPositioner>
      <LoadText />
      <InitialScreenContainer>
        <HStack w="full">
          <Heading size="lg">{t('initial.selectWzTitle')}</Heading>
          <HStack ml="auto">
            <span>{t('initial.loadNewBaseWz')}</span>
            <SelectWzButton />
          </HStack>
        </HStack>
        <Text color="fg.subtle" size="sm">
          {t('initial.wzPositionTip')}
        </Text>
        <Heading size="md">{t('initial.historyTitle')}</Heading>
        <Box w="full" maxHeight="70vh" overflow="auto">
          <SelectHistoryTable />
        </Box>
      </InitialScreenContainer>
    </ScreenPositioner>
  );
};

const ScreenPositioner = styled(VStack, {
  base: {
    mt: 8,
    mx: 'auto',
    width: '100%',
    maxWidth: 'xl',
  },
});

const InitialScreenContainer = styled(VStack, {
  base: {
    p: 4,
    width: '100%',
    alignItems: 'flex-start',
    bg: 'bg.default',
    borderRadius: 'md',
    boxShadow: 'md',
  },
});
