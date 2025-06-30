import { Show, onMount } from 'solid-js';
import { styled } from 'styled-system/jsx';
import { useTranslate } from '@/context/i18n';

import { useStore } from '@nanostores/solid';

import {
  $latestVersion,
  $hasNewVersion,
  updateLatestVersion,
} from '@/store/version';

import { Text } from '@/components/ui/text';

const RELEASE_PAGE_LINK =
  'https://github.com/spd789562/MapleSalon2/releases/latest';

export const LatestVersionLink = () => {
  const t = useTranslate();
  const version = useStore($latestVersion);
  const hasNewVersion = useStore($hasNewVersion);

  onMount(() => {
    updateLatestVersion().catch(console.error);
  });

  return (
    <Show when={hasNewVersion()}>
      <Text color="fg.subtle" size="sm" fontWeight="bold">
        {t('setting.newVersion')}:&nbsp;
        <Link
          as="a"
          href={RELEASE_PAGE_LINK}
          title={t('setting.goToDownload')}
          target="_blank"
        >
          {version()}
        </Link>
      </Text>
    </Show>
  );
};

const Link = styled(Text, {
  base: {
    color: 'colorPalette.default',
  },
});
