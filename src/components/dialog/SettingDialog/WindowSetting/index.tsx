import { useTranslate } from '@/context/i18n';

import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { ResizableSwitch } from './ResizableSwitch';
import { ResolutionSelect } from './ResolutionSelect';
import { WindowScaleSelect } from './WindowScaleSelect';
import { PreservePinSwitch } from './PreservePinSwitch';

export const WindowSetting = () => {
  const t = useTranslate();
  return (
    <Stack>
      <Heading size="lg">{t('setting.windowTitle')}</Heading>
      <HStack justify="space-between">
        <ResizableSwitch />
        <ResolutionSelect />
      </HStack>
      <HStack justify="flex-start">
        <WindowScaleSelect />
        <PreservePinSwitch />
      </HStack>
    </Stack>
  );
};
