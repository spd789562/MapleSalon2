import { useTranslate } from '@/context/i18n';

import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { OnlyDyeableSwitch } from './OnlyDyeableSwitch';
import { PreserveDyeSwitch } from './PreserveDyeSwitch';

export const ItemDyeTabTitle = () => {
  const t = useTranslate();
  return (
    <HStack justify="flex-start">
      <Heading size="2xl" marginRight="4">
        {t('tab.equipDye')}
      </Heading>
      <OnlyDyeableSwitch />
      <PreserveDyeSwitch />
    </HStack>
  );
};
