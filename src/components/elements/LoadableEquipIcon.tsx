import { createSignal, createMemo, Show } from 'solid-js';
import { styled } from 'styled-system/jsx/factory';
import { useStore } from '@nanostores/solid';

import { setItemContextMenuTargetInfo } from '@/store/itemContextMenu';
import { $showItemGender } from '@/store/settingDialog';

import CircleHelpIcon from 'lucide-solid/icons/circle-help';
import { Skeleton } from '@/components/ui/skeleton';
import {
  IconContainer,
  IconImage,
} from '@/components/elements/LoadableIcon';

import { useItemContextTrigger } from '@/context/itemContextMenu';

import { getIconPath, getGender } from '@/utils/itemId';
import { Gender } from '@/utils/itemId';

import DyeableLabelIcon from '@/assets/color_label.png';

export interface LoadableEquipIconProps {
  id: number;
  isDyeable?: boolean;
  name?: string;
  width?: string;
  height?: string;
  folder?: string;
  fill?: boolean;
}
export const LoadableEquipIcon = (props: LoadableEquipIconProps) => {
  const [isLoaded, setIsLoaded] = createSignal(false);
  const [isError, setIsError] = createSignal(false);
  const showItemGender = useStore($showItemGender);

  function onLoad(_: Event) {
    setIsLoaded(true);
  }

  function onError(_: Event) {
    setIsLoaded(true);
    setIsError(true);
  }

  const iconPath = createMemo(() => getIconPath(props.id, props.folder));
  const gender = createMemo(() =>
    showItemGender() ? getGender(props.id) : Gender.Share,
  );

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
        gender={gender()}
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
        <Show when={props.isDyeable}>
          <DyeableLabel src={DyeableLabelIcon} alt="Dyeable" />
        </Show>
      </IconContainer>
    </Skeleton>
  );
};

const DyeableLabel = styled('img', {
  base: {
    position: 'absolute',
    bottom: '1',
    right: '1',
  },
});
