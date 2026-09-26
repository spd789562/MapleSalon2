import { createSignal, createMemo, Show } from 'solid-js';

import { setItemContextMenuTargetInfo } from '@/store/itemContextMenu';

import CircleHelpIcon from 'lucide-solid/icons/circle-help';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IconContainer,
  IconImage,
} from '@/components/elements/LoadableIcon';

import { useItemContextTrigger } from '@/context/itemContextMenu';

import { getSkillIconPath } from '@/utils/itemId';

export interface LoadableSkillIconProps {
  id: string;
  name?: string;
  width?: string;
  height?: string;
  folder?: string;
  isSkill?: boolean;
  fill?: boolean;
}
export const LoadableSkillIcon = (props: LoadableSkillIconProps) => {
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [isError, setIsError] = createSignal(false);

  function onLoad(_: Event) {
    setIsLoaded(true);
  }

  function onError(_: Event) {
    setIsLoaded(true);
    setIsError(true);
  }

  const iconPath = createMemo(() => getSkillIconPath(props.id, props.folder));

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
      <IconContainer
        style={
          props.width || props.height
            ? { width: props.width, height: props.height }
            : undefined
        }
      >
        <Show when={!isError()} fallback={<CircleHelpIcon />}>
          <IconImage
            {...contextTriggerProps}
            onContextMenu={handleContextMenu}
            src={iconPath()}
            alt={props.name || props.id.toString()}
            onLoad={onLoad}
            onError={onError}
            fill={props.fill}
          />
        </Show>
      </IconContainer>
    </Skeleton>
  );
};
