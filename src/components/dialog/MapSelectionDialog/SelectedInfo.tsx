import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';

import { $selectedMap } from '@/store/mapleMap';

import { VStack } from 'styled-system/jsx/vstack';
import { Heading } from '@/components/ui/heading';
import { SimpleTextClipboard } from '@/components/ui/clipboard';
import { MinimapImage } from './MinimapImage';

export const SelectedInfo = () => {
  const selectedMap = useStore($selectedMap);

  return (
    <VStack width="full" gap="1" alignItems="flex-start">
      <Show
        when={selectedMap()}
        fallback={<EmptyBlock>尚未選擇地圖</EmptyBlock>}
      >
        {(info) => (
          <>
            <Heading as="h4" size="lg">
              小地圖預覽:
            </Heading>
            <MinimapImage
              id={info().id}
              name={info().name}
              region={info().region}
            />
            <Heading as="h4" size="lg">
              地圖區域:
            </Heading>
            <SimpleTextClipboard value={info().region} />
            <Heading as="h4" size="lg">
              地圖名稱:
            </Heading>
            <SimpleTextClipboard value={info().name} />
            <Heading as="h5" size="lg">
              地圖 ID:
            </Heading>
            <SimpleTextClipboard value={info().id} />
          </>
        )}
      </Show>
    </VStack>
  );
};

export const EmptyBlock = styled('div', {
  base: {
    width: 'full',
    py: '8rem',
    border: '2px dashed',
    borderColor: 'bg.emphasized',
    borderRadius: 'xl',
    textAlign: 'center',
    color: 'fg.subtle',
    fontSize: 'xl',
  },
});
