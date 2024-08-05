import { Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { HStack } from 'styled-system/jsx/hstack';
import { VStack } from 'styled-system/jsx/vstack';
import { Heading } from '@/components/ui/heading';
import { ActionCharacter, type ActionCharacterRef } from './ActionCharacter';

import { CharacterActionNames, type CharacterAction } from '@/const/actions';

export interface ActionCardProps {
  action: CharacterAction;
  ref: (element: ActionCharacterRef) => void;
}
export const ActionCard = (props: ActionCardProps) => {
  return (
    <CardContainer>
      <HStack w="full">
        <Heading size="xl">
          <Show
            when={CharacterActionNames[props.action]}
            fallback={props.action}
          >
            {(name) => name()}
          </Show>
        </Heading>
        <HStack marginLeft="auto">1</HStack>
      </HStack>
      <ActionCharacter ref={props.ref} action={props.action} />
    </CardContainer>
  );
};

export const CardContainer = styled(VStack, {
  base: {
    p: 4,
    borderRadius: 'md',
    boxShadow: 'md',
    backgroundColor: 'bg.default',
    width: '100%',
  },
});
