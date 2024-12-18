import { useStore } from '@nanostores/solid';

import { $mapTargetLayer } from '@/store/mapleMap';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import {
  NumberInput,
  type ValueChangeDetails,
} from '@/components/ui/numberInput';
import { IconCssTooltip, IconType } from '@/components/elements/IconTooltip';

export const TargetLayerNumberInput = () => {
  const count = useStore($mapTargetLayer);

  function handleCountChange(details: ValueChangeDetails) {
    $mapTargetLayer.set(details.valueAsNumber);
  }

  return (
    <HStack>
      <Text>物體圖層</Text>
      <IconCssTooltip
        tooltip="變更物體所在的圖層，避免地圖物件遮擋"
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
