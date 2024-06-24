import { createSignal, Show } from 'solid-js';

import CircleHelpIcon from 'lucide-solid/icons/circle-help';
import { Skeleton } from './ui/skeleton';
import { Flex } from 'styled-system/jsx/flex';

import { getIconPath } from '@/utils/itemId';

export interface LoadableEquipIconProps {
  id: number;
  name?: string;
  width?: string;
  height?: string;
}
export const LoadableEquipIcon = (props: LoadableEquipIconProps) => {
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [isError, setIsError] = createSignal(false);

  function onLoad(_: Event) {
    setIsLoaded(true);
  }

  function onError(_: Event) {
    setIsLoaded(true);
    setIsError(true);
  }

  return (
    <Skeleton isLoaded={isLoaded()}>
      <Flex
        width={/* @once */ props.width || '8'}
        height={/* @once */ props.height || '8'}
        justify="center"
        align="center"
        color="fg.muted"
      >
        <Show when={!isError()} fallback={<CircleHelpIcon />}>
          <img
            src={getIconPath(props.id)}
            alt={props.name || props.id.toString()}
            onLoad={onLoad}
            onError={onError}
            style={{ 'max-height': '100%' }}
          />
        </Show>
      </Flex>
    </Skeleton>
  );
};
