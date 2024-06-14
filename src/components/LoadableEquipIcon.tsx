import { createSignal } from 'solid-js';

import { Skeleton } from './ui/skeleton';
import { Flex } from 'styled-system/jsx/flex';

import { getIconPath } from '@/utils/itemId';

export interface LoadableEquipIconProps {
  id: number;
  name?: string;
}
export const LoadableEquipIcon = (props: LoadableEquipIconProps) => {
  const [isLoaded, setIsLoaded] = createSignal(false);

  function onLoad(_: Event) {
    setIsLoaded(true);
  }

  return (
    <Skeleton isLoaded={isLoaded()}>
      <Flex width="32px" height="32px" justify="center" align="center">
        <img
          src={getIconPath(props.id)}
          alt={props.name || props.id.toString()}
          onLoad={onLoad}
          onError={onLoad}
          style={{ 'max-height': '100%' }}
        />
      </Flex>
    </Skeleton>
  );
};