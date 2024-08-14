import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { ResizableSwitch } from './ResizableSwitch';
import { ResolutionSelect } from './ResolutionSelect';

export const WindowSetting = () => {
  return (
    <Stack>
      <Heading size="md">視窗設定</Heading>
      <HStack justify="space-between">
        <ResizableSwitch />
        <ResolutionSelect />
      </HStack>
    </Stack>
  );
};
