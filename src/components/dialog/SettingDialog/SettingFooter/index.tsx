import { createSignal, onMount } from 'solid-js';
import { getVersion } from '@tauri-apps/api/app';

import { HStack } from 'styled-system/jsx';
import { Text } from '@/components/ui/text';

export const SettingFooter = () => {
  const [version, setVersion] = createSignal<string>();
  onMount(async () => {
    setVersion(await getVersion());
  });

  return (
    <HStack>
      <Text marginLeft="auto" size="sm" color="fg.subtle">
        當前版本: {version()}
      </Text>
    </HStack>
  );
};
