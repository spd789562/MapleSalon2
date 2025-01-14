import { styled } from 'styled-system/jsx/factory';

import { useTranslate } from '@/context/i18n';

import TranslateIcon from 'mingcute_icon/svg/editor/translate_2_line.svg';
import { Box } from 'styled-system/jsx/box';
import { VStack } from 'styled-system/jsx/vstack';
import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { LocaleSelect } from '@/components/elements/LocaleSelect';
import { ColorModeToggleGroup } from '@/components/dialog/SettingDialog/ThemeSetting/ColorModeToggleGroup';

import { LoadText } from './LoadText';
import { SelectWzButton } from './SelectWzButton';
import { SelectHistoryTable } from './SelectHistoryTable';

export const InitialScreen = () => {
  const t = useTranslate();
  return (
    <ScreenPositioner>
      <LoadText />
      <TopSetting>
        <LangSelectBox>
          <div title={t('setting.language')}>
            <TranslateIcon width="32" height="32" />
          </div>
          <LocaleSelect />
        </LangSelectBox>
        <ColorModeToggleGroup />
      </TopSetting>
      <InitialScreenContainer>
        <HStack w="full">
          <Heading size="lg">{t('initial.selectWzTitle')}</Heading>
          <HStack ml="auto">
            <span>{t('initial.selectNewFile')}</span>
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
    pt: 8,
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

const TopSetting = styled(HStack, {
  base: {
    width: '100%',
    justifyContent: 'center',
  },
});
const LangSelectBox = styled(HStack, {
  base: {
    width: '12rem',
  },
});
