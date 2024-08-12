import { createSignal, createMemo, Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';

import { setItemContextMenuTargetInfo } from '@/store/itemContextMenu';

import CircleHelpIcon from 'lucide-solid/icons/circle-help';
import { Skeleton } from './ui/skeleton';
import { Flex } from 'styled-system/jsx/flex';

import { useItemContextTrigger } from '@/context/itemContextMenu';

import { getIconPath, getGender } from '@/utils/itemId';

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

  const iconPath = createMemo(() => getIconPath(props.id));
  const gender = createMemo(() => getGender(props.id));

  const contextTriggerProps = useItemContextTrigger();

  function handleContextMenu(event: MouseEvent) {
    setItemContextMenuTargetInfo({
      id: props.id,
      name: props.name || props.id.toString(),
      icon: iconPath(),
    });
    const cb = contextTriggerProps.onContextMenu as unknown as (
      event: MouseEvent,
    ) => void;
    cb?.(event);
  }

  return (
    <Skeleton
      height="full"
      display="flex"
      justifyContent="center"
      alignItems="center"
      isLoaded={isLoaded()}
    >
      <IconContainer gender={gender()}>
        <Show when={!isError()} fallback={<CircleHelpIcon />}>
          <img
            {...contextTriggerProps}
            onContextMenu={handleContextMenu}
            src={iconPath()}
            alt={props.name || props.id.toString()}
            onLoad={onLoad}
            onError={onError}
            style={{ 'max-height': '100%' }}
          />
        </Show>
      </IconContainer>
    </Skeleton>
  );
};

const IconContainer = styled(Flex, {
  base: {
    p: '1',
    width: '9',
    height: '9',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'fg.muted',
    borderRadius: 'md',
  },
  variants: {
    gender: {
      0: {
        backgroundColor: 'iris.a5',
      },
      1: {
        backgroundColor: 'tomato.a5',
      },
      2: {
        backgroundColor: 'transparent',
      },
    },
  },
});
