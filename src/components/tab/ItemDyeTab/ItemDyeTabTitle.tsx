import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { OnlyDyeableSwitch } from './OnlyDyeableSwitch';
import { PreserveDyeSwitch } from './PreserveDyeSwitch';

export const ItemDyeTabTitle = () => {
  return (
    <HStack justify="flex-start">
      <Heading size="2xl" marginRight="4">
        裝備染色表
      </Heading>
      <OnlyDyeableSwitch />
      <PreserveDyeSwitch />
    </HStack>
  );
};
