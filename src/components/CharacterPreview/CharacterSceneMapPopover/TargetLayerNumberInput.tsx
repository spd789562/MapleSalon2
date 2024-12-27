import { useStore } from '@nanostores/solid';
import { useTranslate } from '@/context/i18n';

import { $mapTargetLayer } from '@/store/mapleMap';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import {
  NumberInput,
  type ValueChangeDetails,
} from '@/components/ui/numberInput';
import { IconCssTooltip, IconType } from '@/components/elements/IconTooltip';

export const TargetLayerNumberInput = () => {
  const t = useTranslate();
  const count = useStore($mapTargetLayer);

  function handleCountChange(details: ValueChangeDetails) {
    $mapTargetLayer.set(details.valueAsNumber);
  }

  return (
    <HStack>
      <Text>{t('scene.mapTargetLayer')}</Text>
      <IconCssTooltip
        tooltip={t('scene.mapTargetLayerTip')}
        type={IconType.Question}
      />
      <NumberInput
        min={0}
        max={16}
        value={count().toString()}
        onValueChange={handleCountChange}
        allowOverflow={false}
        width="6rem"
        size="sm"
        marginLeft="auto"
      />
    </HStack>
  );
};
