import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $equipmentDrawerExperimentCharacterRender } from '@/store/equipDrawer';

import InfoIcon from 'lucide-solid/icons/info';
import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { SimpleTooltip } from '@/components/ui/tooltip';

export const CharacterRenderingSwitch = () => {
  const t = useTranslate();
  const checked = useStore($equipmentDrawerExperimentCharacterRender);

  function handleChange(detail: ChangeDetails) {
    $equipmentDrawerExperimentCharacterRender.set(detail.checked);
  }

  return (
    <Switch
      id="CharacterRenderingSwitch"
      checked={checked()}
      onCheckedChange={handleChange}
    >
      <HStack gap="1">
        <Text size="sm">{t('setting.characterRender')}</Text>
        <SimpleTooltip zIndex={1500} tooltip={t('setting.characterRenderTip')}>
          <InfoIcon color="currentColor" size="16" />
        </SimpleTooltip>
      </HStack>
    </Switch>
  );
};
