import { useTranslate } from '@/context/i18n';

import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { AddBlackBgToGifSwitch } from './AddBlackBgToGifSwitch';
import { PadWhiteSpaceSwitch } from './PadWhiteSpaceSwitch';
import { ExportTypeToggleGroup } from './ExportTypeToggleGroup';

export const ExportSetting = () => {
  const t = useTranslate();
  return (
    <Stack>
      <Heading size="lg">匯出設定</Heading>
      <HStack justify="flex-start" gap="7">
        <PadWhiteSpaceSwitch />
        <AddBlackBgToGifSwitch />
      </HStack>
      <HStack justify="flex-start">
        <HStack gap="2">
          <Text>{t('export.format')}</Text>
          <ExportTypeToggleGroup />
        </HStack>
      </HStack>
    </Stack>
  );
};
