import { usePureStore } from '@/store';
import {
  $currentMapRect,
  $mapTargetPosX,
  $mapTargetPosY,
} from '@/store/mapleMap';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import {
  NumberInput,
  type ValueChangeDetails,
} from '@/components/ui/numberInput';

export const TargetOffsetNumberInputs = () => {
  const x = usePureStore($mapTargetPosX);
  const y = usePureStore($mapTargetPosY);
  const rect = usePureStore($currentMapRect);

  function handlexChange(details: ValueChangeDetails) {
    $mapTargetPosX.set(details.valueAsNumber);
  }
  function handleyChange(details: ValueChangeDetails) {
    $mapTargetPosY.set(details.valueAsNumber);
  }

  return (
    <HStack justify="space-between">
      <HStack gap="1">
        <Text>X</Text>
        <NumberInput
          min={rect().x}
          max={rect().x + rect().width}
          value={x().toString()}
          onValueChange={handlexChange}
          allowOverflow={false}
          width="6rem"
          size="sm"
        />
      </HStack>
      <HStack gap="1">
        <Text>Y</Text>
        <NumberInput
          min={rect().y}
          max={rect().y + rect().height}
          value={y().toString()}
          onValueChange={handleyChange}
          allowOverflow={false}
          width="6rem"
          size="sm"
        />
      </HStack>
    </HStack>
  );
};
