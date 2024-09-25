import { onMount } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { $currentVersion, updateCurrentVersion } from '@/store/version';

import { HStack } from 'styled-system/jsx';
import { Text } from '@/components/ui/text';
import { DiscordLink } from './DiscordLink';
import { LatestVersionLink } from './LatestVersionLink';

export const SettingFooter = () => {
  const version = useStore($currentVersion);

  onMount(async () => {
    await updateCurrentVersion();
  });

  return (
    <HStack>
      <DiscordLink />
      <HStack marginLeft="auto">
        <LatestVersionLink />
        <Text size="sm" color="fg.subtle">
          當前版本: {version()}
        </Text>
      </HStack>
    </HStack>
  );
};
