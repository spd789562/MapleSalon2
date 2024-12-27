import { useTranslate } from '@/context/i18n';

import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { OpenFolderButton, PathType } from './OpenFolderButton';
import { ClearCacheButton } from './ClearCacheButton';

export const OtherSetting = () => {
  const t = useTranslate();
  return (
    <Stack>
      <Heading size="lg">{t('setting.otherTitle')}</Heading>
      <HStack justify="flex-start">
        <OpenFolderButton
          type={PathType.Data}
          title={t('setting.openSaveFolder')}
        >
          {t('setting.saveFolder')}
        </OpenFolderButton>
        <OpenFolderButton
          type={PathType.Cache}
          title={t('setting.openCacheFolder')}
        >
          {t('setting.cacheFolder')}
        </OpenFolderButton>
        <ClearCacheButton />
      </HStack>
    </Stack>
  );
};
