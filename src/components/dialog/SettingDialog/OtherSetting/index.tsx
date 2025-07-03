import { useTranslate } from '@/context/i18n';

import { openMainTour } from '@/store/tour';

import { Stack } from 'styled-system/jsx/stack';
import { HStack } from 'styled-system/jsx/hstack';
import { Heading } from '@/components/ui/heading';
import { ReWatchTourButton } from './ReWatchTourButton';
import { OpenFolderButton, PathType } from './OpenFolderButton';
import { ClearCacheButton } from './ClearCacheButton';

export const OtherSetting = () => {
  const t = useTranslate();
  return (
    <Stack>
      <Heading size="lg">{t('setting.otherTitle')}</Heading>
      <HStack justify="flex-start">
        <ReWatchTourButton
          openTour={openMainTour}
          title={t('setting.watchTourAgain')}
        />
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
      </HStack>
      <HStack justify="flex-start">
        <ClearCacheButton />
      </HStack>
    </Stack>
  );
};
