import { createSignal } from 'solid-js';

import { styled } from 'styled-system/jsx/factory';

import { HStack } from 'styled-system/jsx/hstack';
import { VStack } from 'styled-system/jsx/vstack';
import { Heading } from '@/components/ui/heading';
import { Switch, type ChangeDetails } from '@/components/ui/switch';
import { HairColorTable } from './HairColorTable';

export const HairDyeTab = () => {
  const [showFullCharacter, setShowFullCharacter] = createSignal(false);

  function handleSwitchChange({ checked }: ChangeDetails) {
    setShowFullCharacter(checked);
  }

  return (
    <VStack>
      <CardContainer>
        <HStack alignItems="flex-end" m="2">
          <Heading size="2xl">髮色預覽</Heading>
          <Switch
            checked={showFullCharacter()}
            onCheckedChange={handleSwitchChange}
          >
            顯示完整腳色
          </Switch>
        </HStack>
        <TableContainer>
          <HairColorTable showFullCharacter={showFullCharacter()} />
        </TableContainer>
      </CardContainer>
    </VStack>
  );
};

const CardContainer = styled('div', {
  base: {
    p: 2,
    borderRadius: 'md',
    boxShadow: 'md',
    backgroundColor: 'bg.default',
    maxWidth: '100%',
  },
});

const TableContainer = styled('div', {
  base: {
    overflowX: 'auto',
    maxWidth: '100%',
  },
});
