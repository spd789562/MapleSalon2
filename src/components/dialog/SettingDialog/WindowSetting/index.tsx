import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { WindowResizableSwitch } from './WindowResizableSwitch';

export const WindowSetting = () => {
  return (
    <Stack>
      <Heading size="md">視窗設定</Heading>
      <HStack>
        <WindowResizableSwitch />
      </HStack>
    </Stack>
  );
};
