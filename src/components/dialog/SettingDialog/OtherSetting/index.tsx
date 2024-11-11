import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { OpenFolderButton, PathType } from './OpenFolderButton';
import { ClearCacheButton } from './ClearCacheButton';

export const OtherSetting = () => {
  return (
    <Stack>
      <Heading size="lg">其他</Heading>
      <HStack justify="flex-start">
        <OpenFolderButton type={PathType.Data} title="開啟存檔資料夾">
          存檔資料夾
        </OpenFolderButton>
        <OpenFolderButton type={PathType.Cache} title="開啟暫存資料夾">
          暫存資料夾
        </OpenFolderButton>
        <ClearCacheButton />
      </HStack>
    </Stack>
  );
};
