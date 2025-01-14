import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $equipmentDrawerOnlyShowDyeable } from '@/store/equipDrawer';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const OnlyShowDyeableSwitch = () => {
  const t = useTranslate();
  const checked = useStore($equipmentDrawerOnlyShowDyeable);

  function handleChange(detail: ChangeDetails) {
    $equipmentDrawerOnlyShowDyeable.set(detail.checked);
  }

  return (
    <HStack>
      <Switch
        id="OnlyShowDyeable"
        size="sm"
        checked={checked()}
        onCheckedChange={handleChange}
        title={t('setting.onlyShowDyeable')}
      />
      <Text as="label" for="switch:OnlyShowDyeable:input" size="sm">
        {t('common.equipDyeable')}
      </Text>
    </HStack>
  );
};
