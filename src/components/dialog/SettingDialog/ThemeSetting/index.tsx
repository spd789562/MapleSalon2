import { useTranslate } from '@/context/i18n';

import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { ThemeRadioGroup } from './ThemeRadioGroup';
import { ColorModeToggleGroup } from './ColorModeToggleGroup';

export const ThemeSetting = () => {
  const t = useTranslate();

  return (
    <Stack>
      <Heading size="lg">{t('setting.themeTitle')}</Heading>
      <HStack justify="space-between">
        <HStack>
          <Text>{t('setting.theme')}</Text>
          <ThemeRadioGroup />
        </HStack>
        <HStack>
          <Text>{t('setting.color')}</Text>
          <ColorModeToggleGroup />
        </HStack>
      </HStack>
    </Stack>
  );
};
