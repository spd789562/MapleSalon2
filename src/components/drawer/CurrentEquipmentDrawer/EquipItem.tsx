import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';

import { createEquipItemByCategory } from '@/store/character';

import { HStack } from 'styled-system/jsx/hstack';
import { VStack } from 'styled-system/jsx/vstack';
import { Box } from 'styled-system/jsx/box';
import { LoadableEquipIcon } from '@/components/LoadableEquipIcon';

import type { EquipSubCategory } from '@/const/equipments';

export interface EquipItemProps {
  category: EquipSubCategory;
}
export const EquipItem = (props: EquipItemProps) => {
  const item = useStore(createEquipItemByCategory(props.category));

  return (
    <Show when={item()}>
      {(item) => (
        <HStack
          p="1"
          borderRadius="md"
          bg="bg.default"
          width="full"
          shadow="sm"
        >
          <LoadableEquipIcon id={item().id} name={item().name} />
          <VStack flex="1" gap={1} alignItems="flex-start">
            <Box flex="1" fontSize="sm">
              <Show when={item().name} fallback={item().id}>
                {item().name}
              </Show>
            </Box>
            <Box flex="1" fontSize="sm">
              1
            </Box>
          </VStack>
        </HStack>
      )}
    </Show>
  );
};
