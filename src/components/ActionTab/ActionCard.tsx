import { type Accessor, Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { HStack } from 'styled-system/jsx/hstack';
import { VStack } from 'styled-system/jsx/vstack';
import { Heading } from '@/components/ui/heading';
import type { ActionCharacterRef } from './ActionCharacter';
import { ExportAnimateButton } from './ExportAnimateButton';
import { ExportFrameButton } from './ExportFrameButton';

import { CharacterActionNames, type CharacterAction } from '@/const/actions';

export interface ActionCardProps {
  action: CharacterAction;
  ref: Accessor<ActionCharacterRef>;
}
export const ActionCard = (props: ActionCardProps) => {
  return (
    <CardContainer>
      <CardTitle w="full">
        <Heading size="lg">
          <Show
            when={CharacterActionNames[props.action]}
            fallback={props.action}
          >
            {(name) => name()}
          </Show>
        </Heading>
        <HStack marginLeft="auto">
          <ExportAnimateButton
            size="xs"
            variant="outline"
            characterRefs={[props.ref()]}
          />
          <ExportFrameButton
            size="xs"
            variant="outline"
            characterRefs={[props.ref()]}
          />
        </HStack>
      </CardTitle>
      <CharacterPlaceholder />
    </CardContainer>
  );
};

const CardContainer = styled(VStack, {
  base: {
    width: '100%',
  },
});

const CardTitle = styled(HStack, {
  base: {
    p: 4,
    borderRadius: 'md',
    boxShadow: 'md',
    backgroundColor: 'bg.default',
    width: '100%',
  },
});

const CharacterPlaceholder = styled(VStack, {
  base: {
    w: 'full',
    minHeight: '300px',
  },
});
