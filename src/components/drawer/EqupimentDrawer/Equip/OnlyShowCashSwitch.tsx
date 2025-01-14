import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $equipmentDrawerOnlyShowCash } from '@/store/equipDrawer';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';

export const OnlyShowCashSwitch = () => {
  const t = useTranslate();
  const checked = useStore($equipmentDrawerOnlyShowCash);

  function handleChange(detail: ChangeDetails) {
    $equipmentDrawerOnlyShowCash.set(detail.checked);
  }

  return (
    <HStack>
      <Switch
        id="OnlyShowCash"
        size="sm"
        checked={checked()}
        onCheckedChange={handleChange}
        title={t('common.onlyShowCash')}
      />
      <Text as="label" for="switch:OnlyShowCash:input" size="sm">
        {t('common.equipCash')}
      </Text>
    </HStack>
  );
};
