import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { ThemeRadioGroup } from './ThemeRadioGroup';
import { ColorModeToggleGroup } from './ColorModeToggleGroup';

export const ThemeSetting = () => {
  return (
    <Stack>
      <Heading size="md">主題設定</Heading>
      <HStack justify="space-between">
        <HStack>
          <Text>主題</Text>
          <ThemeRadioGroup />
        </HStack>
        <HStack>
          <Text>色彩模式</Text>
          <ColorModeToggleGroup />
        </HStack>
      </HStack>
    </Stack>
  );
};
