import { Show, createEffect, createSignal } from 'solid-js';
import { useTranslate } from '@/context/i18n';
import { styled } from 'styled-system/jsx/factory';

import ImageOffIcon from 'lucide-solid/icons/image-off';
import { Flex } from 'styled-system/jsx/flex';
import { Skeleton } from '@/components/ui/skeleton';

import { getMinimapPath } from '@/utils/itemId';

export interface MinimapImageProps {
  id: string;
  region: string;
  name: string;
}
export const MinimapImage = (props: MinimapImageProps) => {
  const t = useTranslate();
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [isError, setIsError] = createSignal(false);

  function onLoad(_: Event) {
    setIsLoaded(true);
  }

  function onError(_: Event) {
    setIsLoaded(true);
    setIsError(true);
  }

  createEffect(() => {
    const _ = props.id;
    setIsError(false);
    setIsLoaded(false);
  });

  return (
    <Skeleton
      width="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      isLoaded={isLoaded()}
    >
      <ImageContainer>
        <Show
          when={!isError()}
          fallback={
            <Flex direction="column" justify="center" align="center" gap="1">
              <ImageOffIcon />
              <span>{t('scene.minimapNotFound')}</span>
            </Flex>
          }
        >
          <img
            src={getMinimapPath(props.id)}
            alt={props.name || props.id}
            title={t('scene.minimapTitle', { name: props.name || props.id })}
            onLoad={onLoad}
            onError={onError}
            style={{ 'max-height': '100%' }}
          />
        </Show>
      </ImageContainer>
    </Skeleton>
  );
};

const ImageContainer = styled(Flex, {
  base: {
    width: 'full',
    aspectRatio: '16 / 9',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'fg.muted',
    borderRadius: 'md',
    border: '1px solid',
    borderColor: 'bg.emphasized',
  },
});
