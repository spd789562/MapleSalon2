import { Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { usePureStore } from '@/store';
import { $currentCharacterInfo } from '@/store/characterInfo';

import { SimpleCharacter } from '@/components/SimpleCharacter';

export const Character = () => {
  const currentCharacterInfo = usePureStore($currentCharacterInfo);

  return (
    <SimpleCharacterContainer>
      <Show when={currentCharacterInfo()?.items}>
        {(items) => (
          <SimpleCharacter
            title=""
            items={items()}
            earType={currentCharacterInfo()?.earType}
          />
        )}
      </Show>
    </SimpleCharacterContainer>
  );
};

const SimpleCharacterContainer = styled('div', {
  base: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    w: 'full',
    h: '220px',
    borderRadius: 'md',
    boxShadow: 'sm',
  },
});
