import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { SimpleCharacterRenderCountInput } from './SimpleCharacterRenderCountInput';

export const RenderSetting = () => {
  return (
    <Stack>
      <Heading size="md">渲染設定</Heading>
      <HStack justify="space-between">
        <SimpleCharacterRenderCountInput />
      </HStack>
    </Stack>
  );
};
