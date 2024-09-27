import { Show, onMount } from 'solid-js';
import { styled } from 'styled-system/jsx';

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
  const version = useStore($latestVersion);
  const hasNewVersion = useStore($hasNewVersion);

  onMount(() => {
    updateLatestVersion().catch(console.error);
  });

  return (
    <Show when={hasNewVersion()}>
      <Text color="fg.subtle" size="sm" fontWeight="bold">
        最新版本:&nbsp;
        <Link
          as="a"
          href={RELEASE_PAGE_LINK}
          title="點擊前往下載"
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
    color: 'accent.default',
  },
});
