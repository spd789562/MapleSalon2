import { styled } from 'styled-system/jsx/factory';

import { Box } from 'styled-system/jsx/box';
import { VStack } from 'styled-system/jsx/vstack';
import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { SelectWzButton } from './SelectWzButton';
import { SelectHistoryTable } from './SelectHistoryTable';

export const InitialScreen = () => {
  return (
    <InitialScreenContainer>
      <HStack w="full">
        <Heading size="lg">選擇需載入的 Base.wz 檔案</Heading>
        <HStack ml="auto">
          <span>選擇新檔</span>
          <SelectWzButton />
        </HStack>
      </HStack>
      <Text color="fg.subtle" size="sm">
        Base.wz 通常存在於 &#123;楓之谷資料夾路徑&#125;/Data/Base/Base.wz
      </Text>
      <Heading size="md">歷史紀錄</Heading>
      <Box w="full" maxHeight="70vh" overflow="auto">
        <SelectHistoryTable />
      </Box>
    </InitialScreenContainer>
  );
};

const InitialScreenContainer = styled(VStack, {
  base: {
    p: 4,
    mt: 8,
    mx: 'auto',
    width: '100%',
    maxWidth: 'xl',
    alignItems: 'flex-start',
    bg: 'bg.default',
    borderRadius: 'md',
    boxShadow: 'md',
  },
});
