import { Show } from 'solid-js';
import { useStore } from '@nanostores/solid';
import { styled } from 'styled-system/jsx/factory';
import { useTranslate } from '@/context/i18n';

import { $selectedMap } from '@/store/mapleMap';

import { VStack } from 'styled-system/jsx/vstack';
import { Heading } from '@/components/ui/heading';
import { SimpleTextClipboard } from '@/components/ui/clipboard';
import { MinimapImage } from './MinimapImage';

export const SelectedInfo = () => {
  const t = useTranslate();
  const selectedMap = useStore($selectedMap);

  return (
    <VStack width="full" gap="1" alignItems="flex-start">
      <Show
        when={selectedMap()}
        fallback={<EmptyBlock>{t('scene.mapUnselected')}</EmptyBlock>}
      >
        {(info) => (
          <>
            <Heading as="h4" size="lg">
              {t('scene.minimapPreview')}:
            </Heading>
            <MinimapImage
              id={info().id}
              name={info().name}
              region={info().region}
            />
            <Heading as="h4" size="lg">
              {t('scene.mapRegion')}:
            </Heading>
            <SimpleTextClipboard value={info().region} />
            <Heading as="h4" size="lg">
              {t('scene.mapName')}:
            </Heading>
            <SimpleTextClipboard value={info().name} />
            <Heading as="h5" size="lg">
              {t('scene.mapId')}:
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
