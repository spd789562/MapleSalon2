import { useStore } from '@nanostores/solid';

import { $preserveOriginalDye } from '@/store/toolTab';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { IconTooltop, IconType } from '@/components/elements/IconTooltip';

export const PreserveDyeSwitch = () => {
  const checked = useStore($preserveOriginalDye);

  function handleChange(details: ChangeDetails) {
    $preserveOriginalDye.set(details.checked);
  }

  return (
    <Switch checked={checked()} onCheckedChange={handleChange}>
      <HStack gap="1">
        <Text>保留裝備染色</Text>
        <IconTooltop
          type={IconType.Question}
          tooltip="保留原裝備染色，關閉後將會重製所有染色才套用染色預覽"
        />
      </HStack>
    </Switch>
  );
};
