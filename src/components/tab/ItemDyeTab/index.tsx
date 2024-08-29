import { styled } from 'styled-system/jsx/factory';

import { Stack } from 'styled-system/jsx/stack';

import { HStack } from 'styled-system/jsx/hstack';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { ItemDyeTabTitle } from './ItemDyeTabTitle';
import { NeedDyeItemToggleGroup } from './NeedDyeItemToggleGroup';
import { DyeTypeRadioGroup } from './DyeTypeRadioGroup';
import { ResultCountNumberInput } from './ResultCountNumberInput';
import { ResultActionSelect } from './ResultActionSelect';
import { StartDyeButton } from './StartDyeButton';
import { DyeResult } from './DyeResult';

export const ItemDyeTab = () => {
  return (
    <Stack mb="4">
      <CardContainer>
        <ItemDyeTabTitle />
        <HStack>
          <Heading width="7rem">欲染色裝備</Heading>
          <NeedDyeItemToggleGroup />
        </HStack>
        <HStack>
          <Heading width="7rem">染色類型</Heading>
          <DyeTypeRadioGroup />
        </HStack>
        <HStack>
          <Heading width="7rem">其他設定</Heading>
          <HStack>
            <Text width="7rem">染色動作</Text>
            <ResultActionSelect />
          </HStack>
          <HStack>
            <Text>染色結果數量</Text>
            <ResultCountNumberInput />
          </HStack>
        </HStack>
        <div>
          <StartDyeButton />
        </div>
      </CardContainer>
      <CardContainer>
        <DyeResult />
      </CardContainer>
    </Stack>
  );
};

export const CardContainer = styled(Stack, {
  base: {
    p: 4,
    borderRadius: 'md',
    boxShadow: 'md',
    backgroundColor: 'bg.default',
    width: '100%',
  },
});
